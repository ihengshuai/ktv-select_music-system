import { AxiosError, AxiosResponse } from "axios";

function onFulfilled(res: AxiosResponse) {
  const result = {
    ...res,
    payload: res.data,
  };
  delete result.data;
  return result;
}

function onRejected(error: AxiosError<any>) {
  throw error;
}

/** 必要的响应拦截器 */
export default { onFulfilled, onRejected };
