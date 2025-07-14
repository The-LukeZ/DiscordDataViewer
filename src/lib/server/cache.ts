import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";
import Cloudflare from "cloudflare";
import { env } from "$env/dynamic/private";
import * as Sentry from "@sentry/sveltekit";
import { createCipheriv, createDecipheriv } from "crypto";

const cf = new Cloudflare({
  apiEmail: env.CLOUDFLARE_EMAIL,
  apiToken: env.CLOUDFLARE_API_TOKEN,
});

const encryptionKey = Buffer.from(env.ENCRYPTION_KEY, "hex");
const encryptionIV = Buffer.from(env.ENCRYPTION_IV, "hex");

function encryptData(data: string): string {
  const cipher = createCipheriv("aes-256-cbc", encryptionKey, encryptionIV);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decryptData(encryptedData: string): string {
  const decipher = createDecipheriv("aes-256-cbc", encryptionKey, encryptionIV);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

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
    const decryptedString = decryptData(jsonWithStrings.value);
    const parsedJson = JSON.parse(decryptedString) as RESTPostOAuth2AccessTokenResult;
    return parsedJson;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

async function setSession(token: string, data: RESTPostOAuth2AccessTokenResult) {
  const res = await cf.kv.namespaces.values.update(env.KV_NAMESPACE_ID, token, {
    account_id: env.CLOUDFLARE_ACCOUNT_ID,
    value: encryptData(JSON.stringify(data)),
    expiration_ttl: 3600 * 24, // 1 day
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
