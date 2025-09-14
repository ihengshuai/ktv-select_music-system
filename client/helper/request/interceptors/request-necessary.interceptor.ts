import { AxiosError, InternalAxiosRequestConfig } from "axios";

import { useConfig } from "@/config";

import { CancelToken } from "../cancel-token";

const { __isDev__ } = useConfig();

function onFulfilled(config: InternalAxiosRequestConfig) {
  // cancel token
  if (config.ignoreCancelToken !== true) {
    CancelToken.instance.register(config);
  }

  // 时间戳
  if (config.timeStamp === true && config.method === "get") {
    Object.assign(config, {
      params: {
        ...config.params,
        _t: +new Date(),
      },
    });
  }

  __isDev__ &&
    console.log(
      `%c 请求日志: %c${config.label ? `【${config.label}】` : ""}`,
      "background:gray;padding:2px 4px;color:#fff;font-weight:600",
      null,
      config
    );

  return config;
}

function onRejected(error: AxiosError<any>) {
  throw error;
}

/** 必要的请求拦截器 */
export default { onFulfilled, onRejected };
