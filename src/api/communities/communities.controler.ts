import Elysia, { t } from "elysia";
import { db } from "../../db";
import { CommunitiesService } from "./communities.service";
import { communitiesPayload } from "./communities.schema";
import { communities } from "../../db/schema";

export const communitiesController = new Elysia({ prefix: "/communities" })
  .get("", async () => {
    const res = await db.select().from(communities).limit(5);

    return { res };
  })
  .post(
    "",
    async ({ body, set }) => {
      try {
        const community = await CommunitiesService.create(body.communities);

        if (community?.code === 422) {
          set.status = 422;

          return {
            error: "Community Already Created",
            code: 422,
          };
        }
        // console.log("error ", community);
        set.status = 201;

        return { community };
      } catch (error) {
        console.log("error adalaah", error);
      }
    },

    {
      body: t.Object({
        communities: communitiesPayload,
      }),
    }
  )
  .delete(
    ":slug",
    async ({ params, set }) => {
      const res = await CommunitiesService.delete(params.slug);

      set.status = 200;

      return {
        success: true,
        message: "Delete Success",
      };
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
    }
  );
