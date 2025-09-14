import { Dictionary } from "vue-router/types/router";
import { LIST_SORTER, TABLE_OPERATION } from "@/constants/common";
import { IDict, IPrimitive } from "./type";
import { ColumnType } from "ant-design-vue/es/table";
import { ButtonProps } from "ant-design-vue/es/button";
import { Ref } from "vue";

/** 排序 */
export interface IListOrder {
  order: LIST_SORTER;
  orderBy: string;
}

/** 列表查询参数 */
export type IListQuery<Q extends IDict<any> = any> = {
  [key in keyof Q]: Q[key];
} & {
  page: number;
  size: number;
} & Partial<IListOrder>;

/** 分页 */
export interface IPager {
  page: number;
  size: number;
  total: number;
}

/** 列表查询结果 */
export interface IListResult<T> {
  pager: IPager;
  items: T[];
}

export type ITableFilter<T extends IDict<any> = any> = {
  [key in keyof T]: ITableFilterItem<T, T[key]>;
};

/**
 * 表格过滤,配合table hooks使用
 */
export interface ITableFilterItem<T = any, R = any> {
  /**
   * 字段值
   */
  value: R | null;
  /**
   * 字段默认值
   */
  defaultValue?:
    | R
    | ((
        val: R | null,
        item: ITableFilterItem<T, R>,
        filters: ITableFilter,
        query: Dictionary<string | string[]>
      ) => IPrimitive)
    | null;
  /**
   * 与后端对接的真实字段
   */
  field?: string;
  /**
   * 是否立即更新
   */
  immediate?: boolean;
  /**
   * 值类型
   */
  type?: NumberConstructor | StringConstructor | BooleanConstructor | ArrayConstructor;
  autoStorage?: boolean;
  /**
   * 验证当前值是否合法
   * @param val 当前值
   * @param item 当前filter项
   * @param filters filters
   * @param query 路由参数
   */
  validate?: (val: any, item: ITableFilterItem, filters: ITableFilter, query: Dictionary<string | string[]>) => boolean;
  /**
   * 对当前值进行转换
   * @param val 当前值
   * @param item 当前filter项
   * @param filters filters
   * @param query 路由参数
   */
  transform?: (val: any, item: ITableFilterItem, filters: ITableFilter, query: Dictionary<string | string[]>) => any;
  /**
   * 对路由上当前参数进行转换(一般路由值和表单值不一致时需要改造时,对路由参数进行转换)
   * @param val 路由上的当前值
   * @param item 当前filter项
   * @param filters filters
   * @param query 路由参数
   */
  parse?: (val: any, item: ITableFilterItem, filters: ITableFilter, query: Dictionary<string | string[]>) => any;
}

/**
 * 表格操作项
 */
export interface IOperation<T = IDict<any>> {
  /**
   * 操作类型
   */
  key: TABLE_OPERATION;
  /**
   * 操作值
   */
  value?: string | ((payload: ITableBodyCell<T>) => any);
  /**
   * 点击后响应逻辑
   */
  handler: (payload: ITableBodyCell<T>) => any;
  /**
   * 验证器,用来控制是否显示
   */
  validator?: (row: ITableBodyCell<T>) => any;
  /**
   * 是否禁用
   */
  disabled?: boolean | ((row: ITableBodyCell<T>) => any);
  /**
   * 自定义值
   */
  customValue?: boolean;
  /**
   * 没有折叠时的按钮类型
   */
  buttonProps?: Partial<ButtonProps & { loading: Ref<boolean> }>;
}

/** tablebody scope slots props  */
export interface ITableBodyCell<T = IDict<any>> {
  /** 单元格内容 */
  text: any;
  /** 单元格值 */
  // value: any;
  /** 单行数据 */
  record: T;
  /** 单元格索引 */
  index: number;
  /** 用户定义表格column属性 */
  column: ColumnType;
}

/** tableheader scope slots props  */
export interface ITableHeaderCell {
  title: any;
  column: ColumnType;
}
