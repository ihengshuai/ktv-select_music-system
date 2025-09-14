import type { GlobalSetupContext } from "vitest/node";

import { getUserAuth } from "~/client/api/auth";
import { HttpClient } from "~/client/util/common/request/constructor";
import { envConfig } from "~/scripts/env";

const { SSL_CERTIFICATE, SSL_CERTIFICATE_KEY, PORT } = envConfig;
const __isHttps__ = !!(SSL_CERTIFICATE && SSL_CERTIFICATE_KEY);

declare module "vitest" {
  export interface ProvidedContext {
    __isHttps__: boolean;
    PORT: string;
    authorization: string;
  }
}

function initRequest() {
  HttpClient.axiosInstance.defaults.baseURL = `${__isHttps__ ? "https" : "http"}://localhost:${PORT}`;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function setup(context: GlobalSetupContext) {
  const { provide } = context;
  initRequest();

  console.log("global setup....");
  await sleep(500);
  await provideUserAccessToken(context);

  provide("__isHttps__", __isHttps__);
  provide("PORT", PORT);

  return () => null;
}

async function provideUserAccessToken({ provide }: GlobalSetupContext) {
  const res = await getUserAuth();
  if (res.accessToken) {
    provide("authorization", res.accessToken);
  }
  console.log("用户token", res.accessToken);
}
