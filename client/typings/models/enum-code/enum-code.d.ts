import { YoN } from "@/constants/common";
import { ENUM_CODE } from "@/constants/enum-code";
import { IBaseDateTime, IBaseQuery } from "@/typings/common/common";

/** 枚举数据 */
export interface IEnumCodeVO extends IBaseDateTime {
  id: number;

  code: ENUM_CODE;

  value: string;

  status: YoN;

  remark: string;
}

export interface IQueryEnumCodeDTO extends IBaseQuery {
  code: string;
  status: YoN;
}

export interface IUpdateEnumCodeDTO {
  value: string;

  status: YoN;

  remark: string;
}

export interface ICreateEnumCodeDTO extends IUpdateEnumCodeDTO {
  code: string;
}
