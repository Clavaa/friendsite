import { GoogleAuth } from "google-auth-library";

/**
 * Read-only BigQuery access for the /admin report. Uses its own service
 * account (GCP_TRAFFIC_READER_SA: dataset READER + project jobUser) so the
 * public beacon's writer key never gains read access.
 */

const PROJECT = "sproutwell-aba-260907";
const BASE = `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT}`;

let auth: GoogleAuth | null = null;
function getAuth(): GoogleAuth {
  if (auth) return auth;
  const raw = process.env.GCP_TRAFFIC_READER_SA;
  // Local dev falls back to your own gcloud login (application default credentials).
  if (!raw && process.env.NODE_ENV === "production") throw new Error("GCP_TRAFFIC_READER_SA is not set");
  auth = new GoogleAuth({
    ...(raw ? { credentials: JSON.parse(raw) } : { projectId: PROJECT }),
    scopes: ["https://www.googleapis.com/auth/bigquery.readonly"],
  });
  return auth;
}

type Field = { name: string };
type Resp = {
  jobComplete?: boolean;
  jobReference?: { jobId: string; location?: string };
  schema?: { fields: Field[] };
  rows?: { f: { v: unknown }[] }[];
  pageToken?: string;
  error?: { message: string };
};

export type Row = Record<string, string | null>;

/** Runs a standard-SQL query and returns every row as {column: string|null}. */
export async function query(sql: string): Promise<Row[]> {
  const client = await getAuth().getClient();
  const token = (await client.getAccessToken()).token;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  let res: Resp = await fetch(`${BASE}/queries`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: sql, useLegacySql: false, timeoutMs: 30000, maxResults: 20000 }),
    cache: "no-store",
  }).then((r) => r.json());
  if (res.error) throw new Error(res.error.message);

  const out: Row[] = [];
  const job = res.jobReference;
  for (;;) {
    if (res.jobComplete && res.schema) {
      const names = res.schema.fields.map((f) => f.name);
      for (const r of res.rows ?? []) {
        const o: Row = {};
        r.f.forEach((c, i) => (o[names[i]] = c.v == null ? null : String(c.v)));
        out.push(o);
      }
      if (!res.pageToken) return out;
    }
    if (!job) return out;
    const qs = new URLSearchParams({ timeoutMs: "30000", maxResults: "20000" });
    if (res.jobComplete && res.pageToken) qs.set("pageToken", res.pageToken);
    if (job.location) qs.set("location", job.location);
    res = await fetch(`${BASE}/queries/${job.jobId}?${qs}`, { headers, cache: "no-store" }).then((r) => r.json());
    if (res.error) throw new Error(res.error.message);
  }
}
