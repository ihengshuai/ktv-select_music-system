// @ts-ignore
import dayjs from "dayjs";

import { dayOfWeek } from "@/constants/date";

export function toDayjs(date: Date | string | number): dayjs.Dayjs {
  return dayjs(date);
}

/** 格式化日期 */
export function formatDate(date: Date | string | number, format = "YYYY-MM-DD HH:mm"): string | null {
  if (!date) return null;
  return dayjs(date).format(format);
}

/** 是否合法日期 */
export function isValidDate(date: Date | string | number): boolean {
  return dayjs(date).isValid();
}

/** 获取星期几 */
export function getDayOfWeek(date?: Date | string | number): number {
  const DATE = toDayjs(date || new Date());

  const day = DATE.day();
  return day;
}

/** 获取星期几字符串 */
export function getDayOfWeekString(date?: Date | string | number) {
  const day = getDayOfWeek(date);

  return dayOfWeek[day];
}
