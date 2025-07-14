import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";
import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 120,
  errorOnMissing: false,
});

function getSession(token: string) {
  return cache.get<RESTPostOAuth2AccessTokenResult>(token);
}

function setSession(token: string, data: RESTPostOAuth2AccessTokenResult) {
  cache.set(token, data);
}

export { getSession, setSession };
