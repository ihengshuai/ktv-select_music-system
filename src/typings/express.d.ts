/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
import { File } from "multer";
import { IToken } from "./application";

declare global {
  namespace Express {
    interface Multer {
      File: File;
    }

    interface Request {
      /** 用户token用来注解传递 */
      __token__: IToken;
    }
  }
}
