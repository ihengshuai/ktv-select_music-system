import { RuleObject } from "ant-design-vue/es/form";
import { IDict } from "./type";

/**
 * 表单model每一项
 */
export type IFormModelItem<P = any, C = any> = {
  /**
   * 表单值
   */
  value: C | null;
  /**
   * 默认值
   */
  defaultValue?: C | null;
  /**
   * 当前表单可能需要异步加载
   */
  loading?: boolean;
  /**
   * 真实字段：使用”.“进行层级分隔
   *
   *  1：提交时转换成对应字段
   *
   *  2：回显时根据field回显
   */
  field?: string; // 后端字段
  placeholder?: any;
  /**
   * 非表单字段，false时不会提交当前字段
   */
  isForm?: boolean;
  /**
   * 是否合法，用来自定义错误显示判断依据
   */
  invalid?: boolean;
  /**
   * 值类型：Number、String、Boolean（后于transform，只会执行一个）
   */
  type?: NumberConstructor | StringConstructor | BooleanConstructor | ArrayConstructor;
  /**
   * 表单提交时进行相关转换（优于type，只会执行一个）
   */
  transform?: (val: C, model: IFormModel<P>) => C; // 提交时获取数据，并对其进行转换
  /**
   * form显示label，这里用函数，方便灵活改变
   */
  label?: () => any;
  /**
   * 是否显示，动态表单时进行判断
   */
  isShow?: () => boolean;
};

/**
 * 表单model,用来提交给后端的数据结构
 * model结构为一层扁平结构,如果后端数据模型有嵌套,全部扁平到一级,然后使用`field`来转换成真实字段
 *  @example
 *    真实数据
 *    IUserPayload {
 *      name: string;
 *      age: number;
 *      address?: { country?: string; city?: string; }
 * }
 *
 *    扁平结构定义
 *    IUser {
 *      name: string;
 *      age: number;
 *      country: string;
 *      city?: string;
 * }
 *
 *    定义FormModel表单数据(泛型有类型提示)
 *    model: IFormModel<IUser> = {
 *      name: {value: null},
 *      age: {value: null},
 *      country: {value: null, field: "address.country"}, // 通过`field`字段定义真实的字段,提交时会自动转换
 *      // ...
 * }
 */
export type IFormModel<T extends Record<string, any> = null> = {
  [k in keyof T]: IFormModelItem<T, T[k]>;
};

/**
 * 初始化model时，对特殊的属性特殊处理（属性必须属于model范畴，这里有类型提示）
 */
export type IFormModelAlterItem<T extends IDict<any>, R = T> = {
  [k in keyof T]?: (val: T[k], data: R) => any;
};

/**
 * 表单检验规则类型注释每项
 */
export type IFormRuleItem<T = any, C = any> = {
  validator?: (rule: any, value: IFormModelItem<T, T[C]>) => any;
} & Omit<RuleObject, "validator">;

/**
 * 表单检验规则类型注释
 */
export type IFormRules<T extends Record<string, any> = null> = {
  [k in keyof T]?: IFormRuleItem<T, k> | IFormRuleItem<T, k>[];
};
