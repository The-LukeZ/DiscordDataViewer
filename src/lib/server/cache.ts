import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";
import Cloudflare from "cloudflare";
import { env } from "$env/dynamic/private";
import * as Sentry from "@sentry/sveltekit";

const cf = new Cloudflare({
  apiEmail: env.CLOUDFLARE_EMAIL,
  apiToken: env.CLOUDFLARE_API_TOKEN,
});

type CloudflareKVJSONResponse = {
  value: string;
  metadata: {};
};

async function getSession(token: string) {
  const res = await cf.kv.namespaces.values
    .get(env.KV_NAMESPACE_ID, token, {
      account_id: env.CLOUDFLARE_ACCOUNT_ID,
    })
    .catch((err) => {
      console.error("Error fetching session:", err);
      return null;
    });

  if (!res) {
    return null;
  }

  const content = await res.blob();
  const text = await content.text();

  try {
    const jsonWithStrings = JSON.parse(text);
    return JSON.parse(jsonWithStrings.value) as RESTPostOAuth2AccessTokenResult;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

async function setSession(token: string, data: RESTPostOAuth2AccessTokenResult) {
  const res = await cf.kv.namespaces.values.update(env.KV_NAMESPACE_ID, token, {
    account_id: env.CLOUDFLARE_ACCOUNT_ID,
    value: JSON.stringify(data),
    expiration_ttl: 3600,
    // Basically extra data to be attached to the KV entry that you can see in a list call if you need to
    metadata: "",
  });

  return !!res;
}

async function deleteSession(token: string) {
  const res = await cf.kv.namespaces.values.delete(env.KV_NAMESPACE_ID, token, {
    account_id: env.CLOUDFLARE_ACCOUNT_ID,
  });

  return !!res;
}

export { getSession, setSession, deleteSession };
