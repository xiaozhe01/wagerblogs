import { Client } from "pg";

// Row-level security guard for the public schema.
//
// Uses `pg` directly and never imports the Payload config: getPayload() runs
// Drizzle's push in dev, which recreates tables and drops RLS — the very thing
// this script exists to repair. Importing it here would make the fix the cause.
//
// Payload connects as a role with rolbypassrls, so RLS never restricts it.
// With no policies defined, RLS denies anon/authenticated entirely, which is
// the intended state: nothing reaches these tables over the Data API.

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Run via `npm run rls:check` / `npm run rls:apply`, " +
        "which load .env.local, or export it yourself.",
    );
  }
  return url;
}

async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({ connectionString: connectionString() });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

type Status = { total: number; enabled: number; missing: string[] };

async function status(client: Client): Promise<Status> {
  const { rows } = await client.query<{ relname: string; on: boolean }>(
    `select c.relname, c.relrowsecurity as on
       from pg_class c
       join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r'
      order by 1`,
  );
  return {
    total: rows.length,
    enabled: rows.filter((r) => r.on).length,
    missing: rows.filter((r) => !r.on).map((r) => r.relname),
  };
}

/** Enables RLS on every public table. Idempotent — re-enabling is a no-op. */
export async function applyRls(): Promise<Status> {
  return withClient(async (client) => {
    const { rows } = await client.query<{ tablename: string }>(
      `select tablename from pg_tables where schemaname = 'public' order by 1`,
    );
    await client.query("begin");
    try {
      for (const { tablename } of rows) {
        await client.query(`alter table public."${tablename}" enable row level security`);
      }
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    }
    return status(client);
  });
}

export async function checkRls(): Promise<Status> {
  return withClient(status);
}

const mode = process.argv[2];

if (mode === "apply") {
  const result = await applyRls();
  console.log(`rls:apply — ${result.enabled}/${result.total} public tables have RLS enabled`);
  if (result.missing.length > 0) {
    throw new Error(`RLS still missing on: ${result.missing.join(", ")}`);
  }
} else if (mode === "check") {
  const result = await checkRls();
  console.log(`rls:check — ${result.enabled}/${result.total} public tables have RLS enabled`);
  if (result.missing.length > 0) {
    console.error(`\nRLS is NOT enabled on ${result.missing.length} table(s):`);
    result.missing.forEach((t) => console.error(`  ${t}`));
    console.error(`\nRestore with: npm run rls:apply`);
    process.exit(1);
  }
} else if (mode !== undefined) {
  throw new Error(`Unknown mode "${mode}". Use "check" or "apply".`);
}
