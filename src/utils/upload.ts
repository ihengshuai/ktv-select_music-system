import { nanoid } from "nanoid";

import { APP_CONFIG } from "@/config";
import { FILE_LOCATION } from "@/consts";

import { decrypt, encrypt } from "./encrypt";

export const StaticPrefixURL = APP_CONFIG.API_PREFIX + "/static/file/";

export function generateStaticTicket(expiresIn = 1000 * 60 * 10) {
  return encrypt(`${nanoid(5)}__(${+new Date() + expiresIn})`);
}

export function verifyStaticTicket(token: string) {
  const decryptTicket = decrypt(token);
  const expiresIn = Number(decryptTicket.match(/.+\((.+)\)/i)?.[1] || 0);

  return expiresIn > +new Date();
}

export function generateStaticURL(fileName: string, location: FILE_LOCATION) {
  if (!fileName) return null;
  return `${StaticPrefixURL}${fileName}?location=${location}&ticket=${generateStaticTicket()}`;
}
