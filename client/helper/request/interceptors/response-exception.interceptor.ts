import { message as Toast } from "ant-design-vue";
import { AxiosResponse, isCancel } from "axios";

import { HttpBusinessException } from "@/helper/exception";

function onFulfilled(res: AxiosResponse) {
  return res;
}

function onRejected(exception: HttpBusinessException) {
  const { code, status, message, stack } = exception;
  const { config } = stack;

  if (__isDev__ && !isCancel(stack)) {
    console.log(
      `%c 错误日志: %c${config?.label ? `【${config.label}】` : `【${config?.url}】`}`,
      "background:red;padding:2px 4px;color:#fff;font-weight:600",
      null,
      code || status,
      message,
      exception.stack
    );
  }

  if (status === 504) {
    Toast.error({ content: "Timeout" });

    return Promise.reject(exception);
  }

  // 根据前后端规定的指定字段状态码进行判断
  if (exception instanceof HttpBusinessException) {
    const { captureError } = config?.$request || {};

    if (captureError !== false) {
      Toast.error({ content: message });
    }
  }

  return Promise.reject(exception);
}

/** 全局错误提示响应拦截器 */
export default { onFulfilled, onRejected };
