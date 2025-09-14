import { isEmpty, isObject, isString } from "@hengshuai/helper";

import { useConfig } from "@/config";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { DeepMerge, IDict } from "@/typings/common/type";

/**
 * 下划线转换驼峰
 */
export function snakeToCamel(data: Record<string, any> | any[] | string): any {
  if (data) {
    if (typeof data === "string") {
      return data.replace(/_([^_])/gi, ($0, $1) => $1.toUpperCase());
    } else if (typeof data === "number" || typeof data === "boolean") {
      return data;
    } else {
      const res: any = data.constructor === Array ? [] : {};
      for (const key in data) {
        // @ts-ignore
        const value = data[key];
        res[snakeToCamel(key) as string] = typeof value !== "object" || value === null ? value : snakeToCamel(value);
      }
      return res;
    }
  }
  return data;
}

export function getLocalStorage<T = any>(key: STORAGE_KEYS): T {
  return localStorage?.getItem(key) as unknown as T;
}

export function setLocalStorage(key: STORAGE_KEYS, value: any) {
  return localStorage?.setItem(key, value);
}

export function setCookie(k: string, v: any, mins: number): void {
  const config = useConfig();
  const d = new Date();
  d.setTime(d.getTime() + mins * 60000);
  const exp = "expires=" + d.toUTCString();
  document.cookie = k + "=" + v + ";" + exp + `;domain=${config.COOKIE_DOMAIN};path=/`;
}

export function getCookie(k: string): string | null {
  const regex = new RegExp("(^| )" + k + "=([^;]*)(;|$)");
  let match;
  if ((match = document.cookie.match(regex))) {
    return unescape(match[2]);
  }
  return null;
}

export function sleep(wait = 500, result?: any) {
  return new Promise(resolve => setTimeout(() => resolve(result), wait));
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

/**
 * 转换字符串query成对象形式
 * @param qs 字符串query
 */
export function qs2obj(qs: string): IDict<any> {
  const res: IDict<any> = {};
  let child: Array<string>;
  qs &&
    qs.split("&").forEach((item: string) => {
      res[(child = item.split("="))[0]] = child[1] || null;
    });
  return res;
}

/**
 * 转换对象query位string
 * @param obj 对象query
 */
export function obj2qs(obj: IDict<any>): string {
  let res = "";
  let val: string;
  obj &&
    Object.keys(obj).forEach((prop: string) => {
      res += "&" + prop;
      (val = obj[prop]) !== null && (res += "=" + val);
    });
  return res.substring(1);
}

/**
 * 将query拼接到url上
 * @param baseURL 地址
 * @param query 字符串或对象query
 */
export function queryToStrURL(baseURL: string | null | undefined, query: string | Record<string, any>): string {
  let hash = null;
  let search = null;
  if (isString(query)) {
    query = qs2obj(query);
  }
  baseURL = (baseURL || "")
    .replace(/#.*$/, function ($0) {
      hash = $0;
      return "";
    })
    .replace(/\?[^#]*/, function ($0) {
      search = $0;
      return "";
    });
  const qsObj = Object.assign(qs2obj((search || (search = "")).substring(1)), query);
  Object.keys(qsObj).forEach(item => isEmpty(qsObj[item]) && delete qsObj[item]);
  const qs = obj2qs(qsObj);

  return baseURL + (qs ? "?" : "") + qs + (hash || (hash = ""));
}

/**
 * 排除对象中的key
 * @param obj 源对象
 * @param keys 要排除的key
 */
export function omit<T extends Record<any, any>, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result: Partial<T> = {};
  if (!obj) {
    return result as Omit<T, K>;
  }
  if (!keys || keys.length === 0) {
    return obj as Omit<T, K>;
  }
  Object.keys(obj).forEach(key => {
    if (!keys.includes(key as K)) {
      result[key as keyof T] = obj[key as keyof T];
    }
  });
  return result as Omit<T, K>;
}

/**
 * 取对象中的key
 * @param obj 源对象
 * @param keys 要取的key
 */
export function pick<T extends Record<any, any>, K extends keyof T = any>(obj: T, ...keys: K[]): Pick<T, K> {
  const result: Partial<Pick<T, K>> = {};
  keys.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  });
  return result as Pick<T, K>;
}

/** 将数组扁平为一级数组 */
export function flatDeepArrayKeyToArray<T extends Record<any, any>, K = keyof T>(arr: T[], key: K) {
  key = key || ("children" as any);
  return arr.reduce((acc, cur): T[] => {
    if (Array.isArray(cur[key as any])) {
      return [...acc, ...flatDeepArrayKeyToArray(cur[key as any], key)] as T[];
    }
    return [...acc, cur];
  }, [] as T[]);
}

/** 将数组扁平为一级数组并转换为对象 */
export function flatDeepArrayKeyToObject<T extends Record<any, any>, K = keyof T>(
  arr: T[],
  key: K
): { [key: string]: T } {
  return arr?.reduce((acc, cur): T => {
    if (Array.isArray(cur[key as any])) {
      return {
        ...acc,
        [cur.key]: cur,
        ...flatDeepArrayKeyToObject(cur[key as any], key),
      } as any;
    }
    return {
      ...acc,
      [cur.key]: cur,
    } as any;
    // @ts-ignore
  }, {});
}

export function deepMerge<T, U>(target: T, source: U): DeepMerge<T, U> {
  if (isObject(target) && isObject(source)) {
    const merged: any = { ...target };

    for (const key in source) {
      if (isObject(source[key])) {
        // @ts-ignore
        merged[key] = deepMerge(target[key as any], source[key]);
      } else {
        merged[key] = source[key];
      }
    }

    return merged;
  }

  return source as DeepMerge<T, U>;
}

/** 深拷贝 */
export function deepCopy(from: any, map: any = new Map()) {
  const isObject = (obj: any): obj is Object =>
    Object.prototype.toString.call(obj) === "[object Object]" ||
    Object.prototype.toString.call(obj) === "[object Array]";

  if (!isObject(from)) return from;
  let res: any = Array.isArray(from) ? [] : {};

  // 有缓存时不用递归，解决循环引用问题
  if (map.get(from)) res = map.get(from);
  else {
    // 缓存当前对象
    map.set(from, res);
    for (const key of [...Object.keys(from), ...Object.getOwnPropertySymbols(from)]) {
      const val = from[key];
      if (isObject(val)) {
        res[key] = deepCopy(val, map);
      } else {
        res[key] = val;
      }
    }
  }
  return res;
}
