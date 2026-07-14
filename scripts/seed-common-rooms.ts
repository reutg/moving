import { createClient } from "@libsql/client";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import { COMMON_LOCATIONS, type CommonLocationKey } from "@/constants";
import { moves, rooms } from "@/lib/db/schema";
import { env } from "@/lib/env";

const main = async () => {
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });
  const db = drizzle(client);

  const allMoves = await db.select().from(moves).all();

  if (allMoves.length === 0) {
    throw new Error("No moves found. Create a move first.");
  }

  const locationEntries = (Object.entries(COMMON_LOCATIONS) as [CommonLocationKey, string][]).filter(
    ([type]) => type !== "other",
  );
  let insertedCount = 0;

  for (const move of allMoves) {
    for (const [type, name] of locationEntries) {
      const [existing] = await db
        .select({ id: rooms.id })
        .from(rooms)
        .where(and(eq(rooms.moveId, move.id), eq(rooms.type, type)))
        .limit(1)
        .all();

      if (existing) {
        continue;
      }

      await db
        .insert(rooms)
        .values({
          moveId: move.id,
          userId: move.userId,
          type,
          name,
          updatedAt: new Date(),
        })
        .run();

      insertedCount += 1;
    }

    console.log(`Move ${move.id} (${move.name}): ensured ${locationEntries.length} common rooms.`);
  }

  console.log(`Done. Inserted ${insertedCount} room(s) across ${allMoves.length} move(s).`);
  client.close();
};

await main();
