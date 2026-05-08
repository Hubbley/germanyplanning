export async function onRequestGet(context) {
  const { env } = context;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    // Don't cache — always serve fresh state
    "Cache-Control": "no-store",
  };

  if (!env.PROGRESS) {
    // KV not yet configured — return empty state gracefully
    return new Response(
      JSON.stringify({ done: {}, notes: {} }),
      { status: 200, headers }
    );
  }

  try {
    const raw = await env.PROGRESS.get("state");

    if (!raw) {
      // No saved state yet — first visit
      return new Response(
        JSON.stringify({ done: {}, notes: {} }),
        { status: 200, headers }
      );
    }

    const data = JSON.parse(raw);
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
