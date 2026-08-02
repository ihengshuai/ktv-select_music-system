import { PROJECT_LANGS } from "@/constants/common";

/**
 * app语言对象
 */
export interface IAppLanguage {
  name: string;
  value: PROJECT_LANGS;
}

/**
 * 通用时间对象
 */
export interface IBaseDateTime {
  createTime: string;
  updateTime: string;
}

/**
 * 通用查询条件
 */
export interface IBaseQuery {
  keywords?: string;
}
