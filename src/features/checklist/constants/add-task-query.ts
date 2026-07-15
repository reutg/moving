import type { ChecklistSectionKey } from "@/constants";

export const ADD_TASK_QUERY_PARAM = "addTask";
export const ADD_TASK_QUERY_VALUE = "1";
export const ADD_TASK_SECTION_QUERY_PARAM = "section";

export const ADD_TASK_HREF = `/checklist?${ADD_TASK_QUERY_PARAM}=${ADD_TASK_QUERY_VALUE}`;

export const getAddTaskHref = (section?: ChecklistSectionKey): string => {
  if (!section) {
    return ADD_TASK_HREF;
  }

  const params = new URLSearchParams({
    [ADD_TASK_QUERY_PARAM]: ADD_TASK_QUERY_VALUE,
    [ADD_TASK_SECTION_QUERY_PARAM]: section,
  });

  return `/checklist?${params.toString()}`;
};
