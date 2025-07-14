// Callback handler for the Discord OAuth2 flow

import { env } from "$env/dynamic/private";
import { discordRoutes } from "$lib";
import { setSession } from "$lib/server/cache.js";
import { redirect } from "@sveltejs/kit";
import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";
import { v4 as uuidV4 } from "uuid";

export async function GET({ url, cookies }) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthState = cookies.get("oauth_state");

  if (!code || !state) {
    return new Response("Missing code or state parameter", { status: 400 });
  }
  if (oauthState !== state) {
    return new Response("Invalid state parameter", { status: 400 });
  }

  const res = await fetch(discordRoutes.token(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: new URL(url.pathname, url.origin).toString(),
    }).toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return new Response(`Error fetching token: ${errorText}`, { status: res.status });
  }

  const data = (await res.json()) as RESTPostOAuth2AccessTokenResult;

  const sessionToken = uuidV4();

  await setSession(sessionToken, data);

  // Make cookie expire after 1 hour
  cookies.set("session", sessionToken, {
    path: "/",
    httpOnly: true,
    maxAge: 3600,
  });

  return redirect(302, "/");
}
