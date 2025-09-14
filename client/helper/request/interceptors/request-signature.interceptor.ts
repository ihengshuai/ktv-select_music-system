import { isEmpty } from "@hengshuai/helper";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
// @ts-ignore
import md5 from "md5";

function onFulfilled(config: InternalAxiosRequestConfig) {
  const params = config.params;
  const data = config.data;

  let str = "";
  if (params) {
    str += Object.keys(params)
      .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
      .filter(k => params[k] !== undefined)
      .map(key => `${key}=${isEmpty(params[key]) ? "" : params[key]}`)
      .join("&");
  }

  if (data && config.method?.toLowerCase() !== "get") {
    str += Object.keys(data)
      .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
      .filter(k => data[k] !== undefined)
      .map(key => `${key}=${data[key] ?? null}`)
      .join("&");
  }

  const signature = md5(str);

  config.params = {
    ...params,
    signature,
  };

  return config;
}

function onRejected(error: AxiosError<any>) {
  throw error;
}

/** 请求签名拦截器 */
export default { onFulfilled, onRejected };
