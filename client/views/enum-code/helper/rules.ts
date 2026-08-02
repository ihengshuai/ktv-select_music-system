import { IFormRules } from "@/typings/common/form";
import { ICreateEnumCodeDTO, IUpdateEnumCodeDTO } from "@/typings/models/enum-code/enum-code";

export function createUpdateEnumCodeRule(): IFormRules<IUpdateEnumCodeDTO> {
  const rules: IFormRules<IUpdateEnumCodeDTO> = {
    value: {
      validator: (rule, { value }) => {
        if (!value?.trim()) return Promise.reject("值不能为空");
        return Promise.resolve();
      },
    },
    status: {
      validator: (rule, { value }) => {
        if (!value) return Promise.reject("请选择状态");
        return Promise.resolve();
      },
    },
  };

  return rules;
}

export function createEnumCodeRule(): IFormRules<ICreateEnumCodeDTO> {
  const rules: IFormRules<ICreateEnumCodeDTO> = {
    code: {
      validator: (rule, { value }) => {
        if (!value?.trim()) return Promise.reject("枚举编码不能为空");
        return Promise.resolve();
      },
    },
    ...(createUpdateEnumCodeRule() as any),
  };

  return rules;
}
