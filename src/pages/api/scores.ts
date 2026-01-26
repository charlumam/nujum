import type { APIRoute } from "astro";

// GET: Fetch saved scores for the signed-in user
export const GET: APIRoute = async (context) => {
  const { locals } = context;

  // Get auth from Clerk middleware
  // @ts-expect-error - auth is injected by Clerk middleware
  const auth = locals.auth();

  if (!auth.userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Access D1 database from Cloudflare runtime
    // @ts-expect-error - runtime is injected by Cloudflare adapter
    const { env } = locals.runtime;
    const db = env.nujum_db;

    const result = await db
      .prepare("SELECT scores FROM user_scores WHERE clerk_user_id = ?")
      .bind(auth.userId)
      .first<{ scores: string }>();

    if (!result) {
      return new Response(JSON.stringify({ scores: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ scores: JSON.parse(result.scores) }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching scores:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch scores" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// POST: Save scores for the signed-in user
export const POST: APIRoute = async (context) => {
  const { locals, request } = context;

  // Get auth from Clerk middleware
  // @ts-expect-error - auth is injected by Clerk middleware
  const auth = locals.auth();

  if (!auth.userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { scores } = body;

    if (!scores || typeof scores !== "object") {
      return new Response(JSON.stringify({ error: "Invalid scores data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Access D1 database from Cloudflare runtime
    // @ts-expect-error - runtime is injected by Cloudflare adapter
    const { env } = locals.runtime;
    const db = env.nujum_db;

    // Upsert: Insert or update the scores for this user
    await db
      .prepare(
        `INSERT INTO user_scores (clerk_user_id, scores, updated_at)
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(clerk_user_id)
         DO UPDATE SET scores = excluded.scores, updated_at = datetime('now')`
      )
      .bind(auth.userId, JSON.stringify(scores))
      .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving scores:", error);
    return new Response(JSON.stringify({ error: "Failed to save scores" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
