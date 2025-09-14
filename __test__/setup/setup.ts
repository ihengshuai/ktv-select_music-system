import { inject } from "vitest";

import { HttpClient } from "~/client/util/common/request/constructor";

const __isHttps__ = inject("__isHttps__");
const PORT = inject("PORT");
const authorization = inject("authorization");
HttpClient.axiosInstance.defaults.baseURL = `${__isHttps__ ? "https" : "http"}://localhost:${PORT}`;
HttpClient.axiosInstance.defaults.headers["authorization"] = authorization;
// @ts-ignore
HttpClient.axiosInstance.defaults.ignoreCancelToken = true;

globalThis.setupName = "setupName";
