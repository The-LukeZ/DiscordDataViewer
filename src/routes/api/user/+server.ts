import { discordRoutes } from "$lib";
import * as Sentry from "@sentry/sveltekit";
import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
  // This was already checked in the server hooks, but for type-checking purposes
  // we need to ensure that the user is logged in and has token data.
  if (!locals.loggedIn || !locals.tokenData) return new Response(null, { status: 401 });

  const res = await fetch(discordRoutes.user(), {
    headers: {
      Authorization: `Bearer ${locals.tokenData.access_token}`,
    },
  });

  if (!res.ok) {
    Sentry.captureMessage("Failed to fetch user: " + res.statusText, {
      level: "error",
      extra: {
        status: res.status,
        url: discordRoutes.user(),
      },
    });

    return new Response(null, { status: res.status });
  }

  const user = await res.json();

  return json(user, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
}
