import { Response } from "express";

import { APP_CONFIG } from "@/config";
import { CAPTCHA_COOKIE_KEY } from "@/consts";
import { IDict } from "@/typings/global";

const { TOKEN_COOKIE } = APP_CONFIG;

export function setTokenCookie(res: Response, token) {
  res.cookie(TOKEN_COOKIE, token, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
  });
}

export function clearTokenCookie(res: Response) {
  res.cookie(TOKEN_COOKIE, null, {
    maxAge: 0,
  });
}

export function setCaptchaCookie(res: Response, value: string, opts?: IDict) {
  res.cookie(CAPTCHA_COOKIE_KEY, value, {
    maxAge: 1000 * 60, // 1 min有效期
    httpOnly: true,
    ...opts,
  });
}

export function clearCaptchaCookie(res: Response) {
  res.cookie(CAPTCHA_COOKIE_KEY, null, {
    maxAge: 0,
  });
}
