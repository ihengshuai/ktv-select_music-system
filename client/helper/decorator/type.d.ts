/** 字段转换 */
export interface IFieldNameTransformOpts {
  /** 提交时的字段 */
  to?: string;
  /** 回显时取值的字段 */
  from?: string;
  /** 属性类型（用于嵌套实体回显） */
  type?: Constructor | Constructor[];
}

/** 通用转换field函数方法 */
export type IBaseTransform<T, K extends keyof T> = (v: T[K], ins: T) => any;

/** 数据转换方法 */
export type ITransformField<T, K extends keyof T> = {
  /** 提交时值转换 */
  to?: IBaseTransform<T, K>;
  /** 回显时值转换 */
  from?: IBaseTransform<T, K>;
};
