import "./interceptor";
import { HttpClient } from "./constructor/base-constructor";

export * from "./concurrency-limit";
export * from "./base-error";
export * from "./cancel-token";

export const request = HttpClient.instance;
