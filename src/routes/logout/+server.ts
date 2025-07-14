import { env } from "$env/dynamic/private";
import { discordRoutes } from "$lib";
import { deleteSession } from "$lib/server/cache";
import { redirect } from "@sveltejs/kit";

export async function GET({ locals, cookies, url }) {
  if (locals.sessionId && locals.tokenData) {
    await fetch(discordRoutes.tokenRevoke(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET,
        token: locals.tokenData.access_token,
        token_type_hint: "access_token",
      }).toString(),
    });

    await deleteSession(locals.sessionId);
    cookies.delete("ddv_session", { path: "/" });
  }

  const reason = url.searchParams.get("reason") || "logout";

  redirect(303, "/" + (reason ? `?reason=${encodeURIComponent(reason)}` : ""));
}
