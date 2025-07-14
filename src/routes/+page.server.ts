import { env } from "$env/dynamic/private";
import { discordRoutes } from "$lib";
import { v4 } from "uuid";

export async function load({ locals }) {
  return {
    loggedIn: locals.loggedIn,
  };
}

export const actions = {
  login: async ({ cookies, url }) => {
    const state = v4();
    const redirectUri = new URL("/api/callback", url.origin).toString();

    const fullUrl =
      discordRoutes.authorize() +
      "?" +
      new URLSearchParams({
        client_id: env.CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "identify guilds",
        state: state,
        prompt: "none",
      }).toString();

    cookies.set("oauth_state", state, {
      httpOnly: true,
      path: "/api/callback",
      sameSite: "lax",
    });

    return {
      success: true,
      url: fullUrl,
    };
  },
};
