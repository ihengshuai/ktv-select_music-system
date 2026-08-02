import { AxiosError, AxiosResponse, isCancel } from "axios";

import { HttpException } from "@/helper/exception";

function onFulfilled(res: AxiosResponse) {
  const result = {
    ...res,
    payload: res.data,
  };
  delete result.data;
  return result;
}

function onRejected(error: AxiosError<any>) {
  let message = error.response?.data?.message || "未知错误";
  let status = error.response?.status || 500;

  if (isCancel(error)) {
    message = "请求取消";
    // @ts-ignore
    status = error.code;
  }

  if (error.response?.status === 504 || error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
    message = "Timeout";
    status = 504;
  }

  const exception = new HttpException(message, status, error);

  return Promise.reject(exception);
}

/** 必要的响应拦截器 */
export default { onFulfilled, onRejected };
