import { IFormRules } from "@/typings/common/form";
import { IOrderCreateDTO } from "@/typings/models/order/order";

export function createOrderFormRules() {
  const rules: IFormRules<IOrderCreateDTO> = {
    longTime: {
      validator: (r, { value }) => {
        if (!value) return Promise.reject("请输入时长");

        return Promise.resolve();
      },
    },
  };

  return rules;
}
