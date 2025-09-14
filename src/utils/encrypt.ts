import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";

import { APP_CONFIG } from "@/config";

const { TOKEN_SECRET } = APP_CONFIG;

export function encrypt(content: string): string {
  const res = AES.encrypt(content, TOKEN_SECRET).toString();

  return res;
}

export function decrypt(content: string): string {
  try {
    const res = AES.decrypt(content.replaceAll(" ", "+"), TOKEN_SECRET).toString(encUtf8);

    return res;
  } catch (e) {
    throw new Error("凭证失败");
  }
}
