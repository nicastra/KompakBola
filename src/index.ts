import { Elysia } from "elysia";

import { cors } from "@elysiajs/cors";
import { communitiesController } from "./api/communities/communities.controler";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .group("/api", (app) => app.use(communitiesController))
  .use(swagger())

  .listen(3022);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
