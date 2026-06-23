import { createClient } from "@libsql/client";
import { desc, eq, inArray, max } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import { boxes, moves } from "@/lib/db/schema";
import { env } from "@/lib/env";

const main = async () => {
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });
  const db = drizzle(client);

  const allMoves = await db.select().from(moves).orderBy(desc(moves.createdAt)).all();
  const movesByUser = new Map<string, typeof allMoves>();

  for (const move of allMoves) {
    const userMoves = movesByUser.get(move.userId) ?? [];
    userMoves.push(move);
    movesByUser.set(move.userId, userMoves);
  }

  let reassignedBoxes = 0;

  for (const [userId, userMoves] of movesByUser) {
    const [currentMove, ...olderMoves] = userMoves.sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
    );

    if (!currentMove || olderMoves.length === 0) {
      continue;
    }

    const olderMoveIds = olderMoves.map((move) => move.id);
    const boxesToMove = await db
      .select()
      .from(boxes)
      .where(inArray(boxes.moveId, olderMoveIds))
      .orderBy(boxes.id)
      .all();

    if (boxesToMove.length === 0) {
      continue;
    }

    const [latestNumberRow] = await db
      .select({ maxNumber: max(boxes.number) })
      .from(boxes)
      .where(eq(boxes.moveId, currentMove.id));

    let nextNumber = (latestNumberRow?.maxNumber ?? 0) + 1;

    for (const box of boxesToMove) {
      await db
        .update(boxes)
        .set({
          moveId: currentMove.id,
          number: nextNumber,
          updatedAt: new Date(),
        })
        .where(eq(boxes.id, box.id))
        .run();

      nextNumber += 1;
      reassignedBoxes += 1;
    }

    console.log(
      `User ${userId}: moved ${boxesToMove.length} box(es) to move ${currentMove.id} (${currentMove.name})`,
    );
  }

  console.log(`Done. Reassigned ${reassignedBoxes} box(es).`);
  client.close();
};

await main();
