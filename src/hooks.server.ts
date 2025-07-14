import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { getSession } from "$lib/server/cache";
import type { Handle } from "@sveltejs/kit";

Sentry.init({
  dsn: "https://2564b960a14c382a2dc38b48edeed802@o4508704165265408.ingest.de.sentry.io/4509663839518800",
});

export const handleError = Sentry.handleErrorWithSentry();

const _handle: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get("session");

  if (sessionToken) {
    const sessionData = getSession(sessionToken);
    if (sessionData) {
      event.locals.tokenData = sessionData;
      event.locals.loggedIn = true;
    } else {
      event.locals.loggedIn = false;
    }
  } else {
    event.locals.loggedIn = false;
  }

  if (event.url.pathname.startsWith("/api/") && event.url.pathname !== "/api/callback") {
    if (!event.locals.loggedIn) {
      return new Response(null, { status: 401, statusText: "Unauthorized" });
    }
  }

  return resolve(event);
};

export const handle = sequence(Sentry.sentryHandle(), _handle);
