import { message } from "ant-design-vue";
import { AxiosError, AxiosResponse, isCancel } from "axios";

function onFulfilled(res: AxiosResponse) {
  return res;
}

function onRejected(err: AxiosError<any>) {
  const { code, config, message: _message } = err || {};

  __isDev__ &&
    console.log(
      `%c 错误日志: %c${config?.label ? `【${config.label}】` : ""}`,
      "background:red;padding:2px 4px;color:#fff;font-weight:600",
      null,
      err.code,
      err.message,
      err
    );

  if (err.response?.status === 504 || err.code === "ETIMEDOUT" || err.code === "ECONNABORTED") {
    message.error({ content: "Timeout" });
    return Promise.reject(err);
  }
  // 根据前后端规定的指定字段状态码进行判断
  if (!isCancel(err) && code !== "ECONNABORTED") {
    const { captureError } = config?.$request || {};
    if (captureError !== false) {
      message.error({ content: _message || "Server Error..." });
    }
  }
  return Promise.reject(err);
}

/** 全局错误提示响应拦截器 */
export default { onFulfilled, onRejected };
