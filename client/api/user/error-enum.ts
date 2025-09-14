import { AxiosError } from "axios";

// import { i18n } from "@/helper";
import { HttpError } from "@/helper/request/http-error/capture-error";

export class TestCaptureError extends HttpError {
  constructor(error: AxiosError) {
    super(error.code!, error.message);

    const msg: Record<string, string> = {
      400: "你小子，你填的参数有误啊",
      401: "你小子，你没有权限啊",
      403: "你小子不太行啊，充钱才给看",
      404: "小伙汁，你想看的找不到了啊.",
      500: "你小子，服务器出问题了啊",
      502: "你小子，服务器被攻击了啊",
      // i18n
      // 1000: i18n.global.t("error.1000")
    };

    this.message = msg[error.code!];
  }
}
