export class ModelAndView<T = Record<string, unknown>> {
  /* 模板引擎中通过 JSON.parse(JSON.stringify(<%- data %>)) 获取所有数据 */
  data: string;

  constructor(data: T) {
    Object.assign(this, data);

    this.data = JSON.stringify(data);
  }

  toJSON() {
    return JSON.parse(this.data);
  }

  static create<T = Record<string, unknown>>(data: T): IModelAndView<T> {
    return new ModelAndView(data) as unknown as IModelAndView<T>;
  }
}

type IModelAndView<T = Record<string, unknown>> = {
  [K in keyof T]: T[K];
} & { /* 模板引擎中通过 JSON.parse(JSON.stringify(<%- data %>)) 获取所有数据 */ data: string; toJSON(): T };
