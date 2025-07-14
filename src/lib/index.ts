// place files you want to import through the `$lib` alias in this folder.

export const discordApi = "https://discord.com/api/v10" as const;

export const discordRoutes = {
  user: () => `${discordApi}/users/@me` as const,
  userGuilds: () => `${discordApi}/users/@me/guilds?with_counts=true` as const,
  token: () => `${discordApi}/oauth2/token` as const,
  tokenRevoke: () => `${discordApi}/oauth2/token/revoke` as const,
  authorize: () => `${discordApi}/oauth2/authorize` as const,
};

export function parseIconToURL(
  icon_hash: string | null | undefined,
  id: string,
  endpoint?: "guild" | "user" | "banner",
): string | undefined;
export function parseIconToURL(
  icon_hash: string | null | undefined,
  id: string,
  endpoint: "user",
): string;

export function parseIconToURL(
  icon_hash: string | null | undefined,
  id: string,
  endpoint: "guild" | "user" | "banner" = "guild",
) {
  if (!icon_hash && endpoint !== "user") return undefined;

  if (endpoint === "user" && !icon_hash) {
    return `https://cdn.discordapp.com/embed/avatars/${(Number(id) >> 22) % 6}.png`;
  }
  if (!icon_hash) {
    return undefined;
  }

  const Routes = {
    guild: "icons/",
    user: "avatars/",
    banner: "banners/",
  } as const;

  return "https://cdn.discordapp.com/" + Routes[endpoint] + `${id}/${icon_hash}.webp`;
}
