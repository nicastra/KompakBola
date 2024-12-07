import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index";

const connection = process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString: connection,
});

export const db = drizzle({ client: pool, schema });
