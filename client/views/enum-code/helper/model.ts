import { reactive } from "vue";

import { IFormModel } from "@/typings/common/form";
import { ITableFilter } from "@/typings/common/table";
import { ICreateEnumCodeDTO, IQueryEnumCodeDTO, IUpdateEnumCodeDTO } from "@/typings/models/enum-code/enum-code";

export function createEnumCodeTableFilter() {
  const filter = reactive<ITableFilter<IQueryEnumCodeDTO>>({
    keywords: {
      value: null,
    },
  });

  return filter;
}

export function createUpdateEnumCodeFormModel() {
  const model: IFormModel<IUpdateEnumCodeDTO> = {
    value: {
      value: null,
    },
    status: {
      value: null,
    },
    remark: {
      value: null,
    },
  };

  return model;
}

export function createEnumCodeFormModel() {
  const model: IFormModel<ICreateEnumCodeDTO> = {
    code: {
      value: null,
    },
    ...createUpdateEnumCodeFormModel(),
  };

  return model;
}
