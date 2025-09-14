import { IDict } from "@/typings/common/type";

export class BaseError extends Error {
  message: string;
  constructor(errorCodeMessageMap: IDict, error: any) {
    super();
    const code = error.code;
    const codeMsg = errorCodeMessageMap[code];

    if (!code || !codeMsg) this.message = error.message;
    else this.message = errorCodeMessageMap[code];
  }
}
