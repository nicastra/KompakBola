import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t, type Static } from "elysia";
import { communities } from "../../db/schema";

export const communitiesInsert = createInsertSchema(communities);
export const communitiesSelect = createInsertSchema(communities);

export type CommunitiesInsert = Static<typeof communitiesInsert>;

export const communitiesBase = t.Pick(communitiesInsert, [
  "name",
  "description",
]);

export type CommunitiesBase = Static<typeof communitiesBase>;

export const communitiesPayload = t.Intersect([communitiesBase]);

export type CommunitiesPayload = Static<typeof communitiesPayload>;
