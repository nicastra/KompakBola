import Elysia, { t } from "elysia";
import { db } from "../../db";
import { CommunitiesService } from "./communities.service";
import { communitiesPayload } from "./communities.schema";
import { communities } from "../../db/schema";
import { param } from "drizzle-orm";

export const communitiesController = new Elysia({ prefix: "/communities" })
  .get("", async () => {
    const res = await db.select().from(communities).limit(5);

    return { res };
  })
  .get(
    ":slug",
    async ({ params, set }) => {
      const res = await CommunitiesService.get(params?.slug);

      console.log(res);
      if (res === undefined) {
        set.status = 404;

        return {
          succes: false,
          message: "Community not found",
        };
      }
      return res;
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
    }
  )
  .post(
    "",
    async ({ body, set }) => {
      try {
        const community = await CommunitiesService.create(body.community);

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
        community: communitiesPayload,
      }),
    }
  )
  .put(
    ":slug",
    async ({ params, body, set }) => {
      try {
        const res = await CommunitiesService.update(
          params?.slug,
          body?.community
        );

        if (res?.code === 404) {
          set.status = 404;

          return {
            success: false,
            message: "Community to edit not found",
          };
        }

        return res;
      } catch (error) {
        // throw new Error("error", error);
        console.log(error);
      }
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      body: t.Object({
        community: communitiesPayload,
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
