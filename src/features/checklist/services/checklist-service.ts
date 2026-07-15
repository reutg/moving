import "server-only";

import { and, asc, count, eq, max } from "drizzle-orm";
import { z } from "zod";

import {
  CHECKLIST_FILTERS,
  CHECKLIST_SECTION_ORDER,
  CHECKLIST_SECTIONS,
  type ChecklistFilter,
  type ChecklistSectionKey,
  DEFAULT_CHECKLIST_FILTER,
  DEFAULT_CHECKLIST_TASKS,
} from "@/constants";
import { db } from "@/lib/db/client";
import { type ChecklistTask, checklistTasks } from "@/lib/db/schema";
import { badRequest, internal, notFound } from "@/lib/errors";

import { getMoveById } from "@/features/moves/services/move-service";

export const CreateChecklistTaskInputSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),
    section: z.enum(CHECKLIST_SECTIONS),
  })
  .strict();

export type CreateChecklistTaskInput = z.infer<typeof CreateChecklistTaskInputSchema>;

export const UpdateChecklistTaskInputSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200).optional(),
    section: z.enum(CHECKLIST_SECTIONS).optional(),
    position: z.number().int().nonnegative().optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.title !== undefined || value.section !== undefined || value.position !== undefined,
    { message: "At least one field is required" },
  );

export type UpdateChecklistTaskInput = z.infer<typeof UpdateChecklistTaskInputSchema>;

export const UpdateChecklistTaskCompletionInputSchema = z
  .object({
    isCompleted: z.boolean(),
  })
  .strict();

export type UpdateChecklistTaskCompletionInput = z.infer<
  typeof UpdateChecklistTaskCompletionInputSchema
>;

const ReorderTaskItemSchema = z
  .object({
    id: z.number().int().positive(),
    position: z.number().int().nonnegative(),
  })
  .strict();

export const ReorderChecklistTasksInputSchema = z
  .object({
    section: z.enum(CHECKLIST_SECTIONS),
    tasks: z.array(ReorderTaskItemSchema).min(1),
  })
  .strict()
  .superRefine((value, context) => {
    const seenIds = new Set<number>();

    for (const task of value.tasks) {
      if (seenIds.has(task.id)) {
        context.addIssue({
          code: "custom",
          message: "Duplicate task ids are not allowed",
          path: ["tasks"],
        });
        return;
      }
      seenIds.add(task.id);
    }
  });

export type ReorderChecklistTasksInput = z.infer<typeof ReorderChecklistTasksInputSchema>;

export const ListChecklistQuerySchema = z
  .object({
    filter: z.enum(CHECKLIST_FILTERS).default(DEFAULT_CHECKLIST_FILTER),
  })
  .strict();

export type ListChecklistQuery = z.infer<typeof ListChecklistQuerySchema>;

export type ChecklistSectionCounts = {
  total: number;
  completed: number;
  open: number;
};

export type ChecklistCounts = ChecklistSectionCounts & {
  sections: Record<ChecklistSectionKey, ChecklistSectionCounts>;
};

export type ChecklistListResult = {
  tasks: ChecklistTask[];
  counts: ChecklistCounts;
};

const emptySectionCounts = (): ChecklistSectionCounts => ({
  total: 0,
  completed: 0,
  open: 0,
});

const createEmptyCounts = (): ChecklistCounts => ({
  total: 0,
  completed: 0,
  open: 0,
  sections: {
    beforeMoving: emptySectionCounts(),
    movingDay: emptySectionCounts(),
    afterMoving: emptySectionCounts(),
  },
});

const sectionSortIndex = (section: ChecklistSectionKey): number =>
  CHECKLIST_SECTION_ORDER.indexOf(section);

const sortChecklistTasks = (tasks: ChecklistTask[]): ChecklistTask[] =>
  [...tasks].sort((left, right) => {
    const sectionDiff = sectionSortIndex(left.section) - sectionSortIndex(right.section);
    if (sectionDiff !== 0) {
      return sectionDiff;
    }

    if (left.isCompleted !== right.isCompleted) {
      return left.isCompleted ? 1 : -1;
    }

    return left.position - right.position;
  });

const filterTasks = (tasks: ChecklistTask[], filter: ChecklistFilter): ChecklistTask[] => {
  if (filter === "open") {
    return tasks.filter((task) => !task.isCompleted);
  }

  if (filter === "completed") {
    return tasks.filter((task) => task.isCompleted);
  }

  return tasks;
};

const buildCounts = (tasks: ChecklistTask[]): ChecklistCounts => {
  const counts = createEmptyCounts();

  for (const task of tasks) {
    const sectionCounts = counts.sections[task.section];
    sectionCounts.total += 1;
    counts.total += 1;

    if (task.isCompleted) {
      sectionCounts.completed += 1;
      counts.completed += 1;
    } else {
      sectionCounts.open += 1;
      counts.open += 1;
    }
  }

  return counts;
};

const assertMoveAccess = async (moveId: number): Promise<void> => {
  await getMoveById(moveId);
};

const listTasksForMove = async (moveId: number): Promise<ChecklistTask[]> => {
  return db
    .select()
    .from(checklistTasks)
    .where(eq(checklistTasks.moveId, moveId))
    .orderBy(asc(checklistTasks.section), asc(checklistTasks.position))
    .all();
};

const getNextPositionForSection = async (
  moveId: number,
  section: ChecklistSectionKey,
): Promise<number> => {
  const [row] = await db
    .select({ maxPosition: max(checklistTasks.position) })
    .from(checklistTasks)
    .where(and(eq(checklistTasks.moveId, moveId), eq(checklistTasks.section, section)))
    .all();

  return (row?.maxPosition ?? -1) + 1;
};

const getTaskInMove = async (moveId: number, taskId: number): Promise<ChecklistTask> => {
  const [task] = await db
    .select()
    .from(checklistTasks)
    .where(and(eq(checklistTasks.id, taskId), eq(checklistTasks.moveId, moveId)))
    .limit(1)
    .all();

  if (!task) {
    throw notFound(`Checklist task ${taskId} not found`);
  }

  return task;
};

const normalizeSectionPositions = async (
  moveId: number,
  section: ChecklistSectionKey,
): Promise<void> => {
  const sectionTasks = await db
    .select()
    .from(checklistTasks)
    .where(and(eq(checklistTasks.moveId, moveId), eq(checklistTasks.section, section)))
    .orderBy(asc(checklistTasks.position), asc(checklistTasks.id))
    .all();

  await db.transaction(async (tx) => {
    for (const [index, task] of sectionTasks.entries()) {
      if (task.position === index) {
        continue;
      }

      await tx
        .update(checklistTasks)
        .set({ position: index, updatedAt: new Date() })
        .where(eq(checklistTasks.id, task.id))
        .run();
    }
  });
};

export const listChecklist = async (
  moveId: number,
  filter: ChecklistFilter = DEFAULT_CHECKLIST_FILTER,
): Promise<ChecklistListResult> => {
  await assertMoveAccess(moveId);

  const tasks = await listTasksForMove(moveId);
  const counts = buildCounts(tasks);
  const filteredTasks = sortChecklistTasks(filterTasks(tasks, filter));

  return {
    tasks: filteredTasks,
    counts,
  };
};

export const createChecklistTask = async (
  moveId: number,
  input: CreateChecklistTaskInput,
): Promise<ChecklistTask> => {
  await assertMoveAccess(moveId);

  const position = await getNextPositionForSection(moveId, input.section);
  const now = new Date();

  const inserted = await db
    .insert(checklistTasks)
    .values({
      moveId,
      title: input.title,
      section: input.section,
      position,
      isCompleted: false,
      updatedAt: now,
    })
    .returning()
    .all();

  const task = inserted[0];
  if (!task) {
    throw internal("Failed to create checklist task");
  }

  return task;
};

export const updateChecklistTask = async (
  moveId: number,
  taskId: number,
  input: UpdateChecklistTaskInput,
): Promise<ChecklistTask> => {
  await assertMoveAccess(moveId);

  const existing = await getTaskInMove(moveId, taskId);
  const nextSection = input.section ?? existing.section;
  const sectionChanged = nextSection !== existing.section;
  const nextPosition = await resolveUpdatedPosition(
    moveId,
    existing,
    nextSection,
    sectionChanged,
    input.position,
  );

  const updated = await db
    .update(checklistTasks)
    .set({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.section !== undefined ? { section: input.section } : {}),
      position: nextPosition,
      updatedAt: new Date(),
    })
    .where(and(eq(checklistTasks.id, existing.id), eq(checklistTasks.moveId, moveId)))
    .returning()
    .all();

  const task = updated[0];
  if (!task) {
    throw notFound(`Checklist task ${taskId} not found`);
  }

  if (sectionChanged) {
    await normalizeSectionPositions(moveId, existing.section);
  }

  return task;
};

const resolveUpdatedPosition = async (
  moveId: number,
  existing: ChecklistTask,
  nextSection: ChecklistSectionKey,
  sectionChanged: boolean,
  explicitPosition?: number,
): Promise<number> => {
  if (explicitPosition !== undefined) {
    return explicitPosition;
  }

  if (sectionChanged) {
    return getNextPositionForSection(moveId, nextSection);
  }

  return existing.position;
};

export const updateChecklistTaskCompletion = async (
  moveId: number,
  taskId: number,
  input: UpdateChecklistTaskCompletionInput,
): Promise<ChecklistTask> => {
  await assertMoveAccess(moveId);

  const existing = await getTaskInMove(moveId, taskId);

  if (existing.isCompleted === input.isCompleted) {
    return existing;
  }

  const updated = await db
    .update(checklistTasks)
    .set({
      isCompleted: input.isCompleted,
      updatedAt: new Date(),
    })
    .where(and(eq(checklistTasks.id, existing.id), eq(checklistTasks.moveId, moveId)))
    .returning()
    .all();

  const task = updated[0];
  if (!task) {
    throw notFound(`Checklist task ${taskId} not found`);
  }

  return task;
};

export const deleteChecklistTask = async (moveId: number, taskId: number): Promise<void> => {
  await assertMoveAccess(moveId);

  const existing = await getTaskInMove(moveId, taskId);

  const result = await db
    .delete(checklistTasks)
    .where(and(eq(checklistTasks.id, existing.id), eq(checklistTasks.moveId, moveId)))
    .run();

  if (result.rowsAffected === 0) {
    throw notFound(`Checklist task ${taskId} not found`);
  }

  await normalizeSectionPositions(moveId, existing.section);
};

export const reorderChecklistTasks = async (
  moveId: number,
  input: ReorderChecklistTasksInput,
): Promise<ChecklistTask[]> => {
  await assertMoveAccess(moveId);

  const sectionTasks = await db
    .select()
    .from(checklistTasks)
    .where(and(eq(checklistTasks.moveId, moveId), eq(checklistTasks.section, input.section)))
    .all();

  const sectionTaskIds = new Set(sectionTasks.map((task) => task.id));

  if (input.tasks.length !== sectionTasks.length) {
    throw badRequest("Reorder must include every task in the section");
  }

  for (const task of input.tasks) {
    if (!sectionTaskIds.has(task.id)) {
      throw badRequest("All reordered tasks must belong to the same move and section");
    }
  }

  await db.transaction(async (tx) => {
    for (const task of input.tasks) {
      await tx
        .update(checklistTasks)
        .set({
          position: task.position,
          updatedAt: new Date(),
        })
        .where(and(eq(checklistTasks.id, task.id), eq(checklistTasks.moveId, moveId)))
        .run();
    }
  });

  const tasks = await listTasksForMove(moveId);
  return sortChecklistTasks(tasks.filter((task) => task.section === input.section));
};

export const seedDefaultChecklistTasks = async (moveId: number): Promise<void> => {
  await assertMoveAccess(moveId);

  const [existing] = await db
    .select({ tasksCount: count() })
    .from(checklistTasks)
    .where(eq(checklistTasks.moveId, moveId))
    .all();

  if ((existing?.tasksCount ?? 0) > 0) {
    return;
  }

  const positionBySection: Record<ChecklistSectionKey, number> = {
    beforeMoving: 0,
    movingDay: 0,
    afterMoving: 0,
  };

  const now = new Date();

  await db
    .insert(checklistTasks)
    .values(
      DEFAULT_CHECKLIST_TASKS.map((task) => {
        const position = positionBySection[task.section];
        positionBySection[task.section] += 1;

        return {
          moveId,
          title: task.title,
          section: task.section,
          position,
          isCompleted: false,
          updatedAt: now,
        };
      }),
    )
    .run();
};
