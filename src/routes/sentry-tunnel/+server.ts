import { json } from "@sveltejs/kit";

// TODO: Maybe implement this tunnel route if know how to
export async function POST({ request }) {
  return new Response(null, { status: 204 });

  const envelopeBytes = await request.arrayBuffer();
  const envelope = new TextDecoder().decode(envelopeBytes);

  try {
    const piece = envelope.split("\n")[0];
    const header = JSON.parse(piece);
    const dsn = new URL(header["dsn"]);
    const project_id = dsn.pathname?.replace("/", "");

    // ? Maybe: Validate DSN and project_id here

    const upstream_sentry_url = `https://sentry.io/api/${project_id}/envelope/`;

    await fetch(upstream_sentry_url, {
      method: "POST",
      body: envelopeBytes,
      headers: {
        "Content-Type": "application/x-sentry-envelope",
      },
    });

    return json({}, { status: 200 });
  } catch (e) {
    console.error("error tunneling to sentry", e);
    return json({ error: "error tunneling to sentry" }, { status: 500 });
  }
}
