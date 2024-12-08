import { eq } from "drizzle-orm";
import { notFound, toSlug, unprocessable } from "../../common/utils";
import { db } from "../../db";
import { communities } from "../../db/schema";
import {
  CommunitiesBase,
  CommunitiesInsert,
  CommunitiesPayload,
} from "./communities.schema";

export abstract class CommunitiesService {
  static async create(communitiesPayload: CommunitiesPayload) {
    console.log("PAYLOAD", communitiesPayload);
    const { ...communitity } = communitiesPayload;

    const value: CommunitiesInsert[] = [
      { ...communitity, slug: toSlug(communitity?.name) },
    ];

    try {
      const res = await db.insert(communities).values(value).returning();

      if (res?.length === 1) {
        return {
          success: true,
          data: res,
        };
      } else {
        return {
          success: false,
          code: 422,
          data: res,
        };
      }
      // console.log("success", res);
    } catch (error) {
      return unprocessable(error);
    }
  }

  static async get(slug: string) {
    try {
      const community = await db.query.communities.findFirst({
        where: eq(communities.slug, slug),
      });

      return { success: true, code: 200, data: community };
    } catch (error) {
      return unprocessable(error);
    }
  }

  static async delete(slug: string) {
    try {
      const res = await db
        .delete(communities)
        .where(eq(communities.slug, slug))
        .returning();

      return {
        success: true,
        message: "Delete Success",
      };
    } catch (error) {
      return unprocessable(error);
    }
  }

  static async update(slug: string, data: Partial<CommunitiesBase>) {
    try {
      const community = await db.query.communities.findFirst({
        where: eq(communities.slug, slug),
      });

      if (!community?.slug) {
        return {
          succes: false,
          code: 404,
        };
      } else {
        const { name, description } = data;

        const newValue = {
          ...(name && { name, slug: toSlug(name) }),
          ...(description && { description }),
        };

        await db
          .update(communities)
          .set(newValue)
          .where(eq(communities.id, community.id));

        return this.get(newValue?.slug || community.slug);
      }
    } catch (error) {
      return unprocessable(error);
    }
  }
}
