import { AxiosError, AxiosResponse } from "axios";

import { snakeToCamel } from "@/util";

import { CancelToken } from "../cancel-token";

function onFulfilled(res: AxiosResponse) {
  const { payload, config } = res;
  const { data, code = 500, error, message } = payload || {};

  CancelToken.instance.cancel(config);

  // 业务状态码成功
  if (code === 200 || code < 300) {
    __isDev__ &&
      console.log(
        `%c 响应日志: %c${config.label ? `【${config.label}】` : ""}`,
        "background:green;padding:2px 4px;color:#fff;font-weight:600",
        null,
        res
      );

    const { transferToCamel } = config;
    return transferToCamel !== false ? snakeToCamel(data) : data;
  }

  // 业务不成功
  const _error = new Error(error || message || "Server Error...") as AxiosError;
  _error.response = data;
  _error.isAxiosError = false;
  _error.config = config;
  _error.response = res;
  _error.code = code as any;
  throw _error;
}

function onRejected(error: AxiosError<any>) {
  if (error.response?.data?.message) {
    error.message = error.response.data.message;
  }

  return Promise.reject(error);
}

/** 状态码响应拦截器 */
export default { onFulfilled, onRejected };
