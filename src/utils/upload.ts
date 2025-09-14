import { nanoid } from "nanoid";

import { APP_CONFIG } from "@/config";

import { decrypt, encrypt } from "./encrypt";

export const StaticPrefixURL = APP_CONFIG.API_PREFIX + "/static/s3/";

export function generateStaticTicket(expiresIn = 1000 * 60 * 10) {
  return encrypt(`${nanoid(5)}__(${+new Date() + expiresIn})`);
}

export function verifyStaticTicket(token: string) {
  const decryptTicket = decrypt(token);
  const expiresIn = Number(decryptTicket.match(/.+\((.+)\)/i)?.[1] || 0);

  return expiresIn > +new Date();
}

export function generateStaticURL(fileName: string) {
  if (!fileName) return null;
  return `${StaticPrefixURL}${fileName}?ticket=${generateStaticTicket()}`;
}
