import { AxiosError, AxiosResponse } from "axios";

import { HttpBusinessException, HttpException } from "@/helper/exception";
import { snakeToCamel } from "@/util";

import { CancelToken } from "../cancel-token";

function onFulfilled(res: AxiosResponse) {
  const { payload, config } = res;
  const { data, code = 500, message } = payload || {};

  CancelToken.instance.cancel(config);

  // 业务状态码成功
  if (code === 200 || code < 300) {
    __isDev__ &&
      console.log(
        `%c 响应日志: %c${config.label ? `【${config.label}】` : `【${config.url}】`}`,
        "background:green;padding:2px 4px;color:#fff;font-weight:600",
        null,
        res
      );

    const { transferToCamel } = config;
    return transferToCamel !== false ? snakeToCamel(data) : data;
  }

  // 业务不成功
  const exception = new HttpBusinessException(message || "业务未知错误", code, res as unknown as AxiosError<any>);

  throw exception;
}

function onRejected(error: AxiosError<any>) {
  if (error instanceof HttpException) return Promise.reject(error);

  const exception = new HttpException(
    error.response?.data?.message || "未知错误",
    error.response?.status || 500,
    error
  );

  return Promise.reject(exception);
}

/** 状态码响应拦截器 */
export default { onFulfilled, onRejected };
