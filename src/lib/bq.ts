import { GoogleAuth } from "google-auth-library";

/**
 * Streaming insert into sproutwell-aba-260907.sunbird_traffic.events —
 * shared by the visitor beacon (/api/t) and the crawler log (/api/crawl).
 * Never throws: analytics must never break a request.
 */

const PROJECT = "sproutwell-aba-260907";
const TABLE = `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT}/datasets/sunbird_traffic/tables/events/insertAll`;

let auth: GoogleAuth | null = null;
function getAuth(): GoogleAuth | null {
  if (auth) return auth;
  const raw = process.env.GCP_TRAFFIC_SA;
  if (!raw) return null;
  auth = new GoogleAuth({
    credentials: JSON.parse(raw),
    scopes: ["https://www.googleapis.com/auth/bigquery.insertdata"],
  });
  return auth;
}

export async function insertRow(row: Record<string, unknown>): Promise<void> {
  try {
    const a = getAuth();
    if (!a) return;
    const client = await a.getClient();
    const token = (await client.getAccessToken()).token;
    if (!token) return;
    await fetch(TABLE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skipInvalidRows: true,
        ignoreUnknownValues: true,
        rows: [{ json: row }],
      }),
    });
  } catch {
    /* Swallow — logging is best-effort. */
  }
}
