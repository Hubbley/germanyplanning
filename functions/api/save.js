export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers for same-origin requests
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  // Check KV binding exists
  if (!env.PROGRESS) {
    return new Response(
      JSON.stringify({ ok: false, error: "KV binding PROGRESS not configured" }),
      { status: 500, headers }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON" }),
      { status: 400, headers }
    );
  }

  // Validate shape
  if (typeof body !== "object" || body === null) {
    return new Response(
      JSON.stringify({ ok: false, error: "Expected an object" }),
      { status: 400, headers }
    );
  }

  const payload = {
    done: body.done || {},
    notes: body.notes || {},
    updatedAt: new Date().toISOString(),
  };

  try {
    // Store under a fixed key — single shared state for you and your partner
    await env.PROGRESS.put("state", JSON.stringify(payload));
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers }
    );
  }
}

// Handle preflight CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
