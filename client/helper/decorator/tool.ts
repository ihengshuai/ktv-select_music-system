import { resolveEntityFromData } from "@/entities/tool";
import { IConstructor, IDict } from "@/typings/common/type";
import { noop } from "@/util";

import { IBaseTransform, IFieldNameTransformOpts, ITransformField } from "./type";

/**
 * 提交逻辑，通常提交给后端数据时会做一些数据转换等等
 * @param toJSON 转换逻辑
 * @injectTarget Properties
 * @returns 转换后的值
 */
export function ToJSON<T = any, K extends keyof T = any>(toJSON?: IBaseTransform<T, K>): Function {
  return function (target: InstanceType<IConstructor>, key: string) {
    Object.defineProperty(target, `__toJSON__${key.toUpperCase()}`, {
      configurable: false,
      enumerable: false,
      get() {
        if (toJSON) {
          return toJSON;
        }
        // eslint-disable-next-line no-unused-vars
        return (v: T[K], _: T) => v;
      },
    });
  };
}

/**
 * 回显逻辑，通常从后端拿到数据进行格式化等等
 * @param fromJSON 转换逻辑
 * @injectTarget Properties
 * @returns 转换后的值
 */
export function FromJSON<T = any, K extends keyof T = any>(fromJSON?: IBaseTransform<T, K>): Function {
  return function (target: InstanceType<IConstructor>, key: string) {
    Object.defineProperty(target, `__fromJSON__${key.toUpperCase()}`, {
      configurable: false,
      enumerable: false,
      get() {
        if (fromJSON) {
          return fromJSON;
        }
        // eslint-disable-next-line no-unused-vars
        return (v: T[K], _: T) => v;
      },
    });
  };
}

/**
 * 转换逻辑(ToJSON/FromJSON封装)：
 *  1.提交转换
 *  2.回显转换
 * @param transform 转换逻辑
 * @injectTarget Properties
 * @returns 转换后的值
 */
export function Transform<T = any, K extends keyof T = any>(transform?: ITransformField<T, K>): Function {
  const { to, from } = transform || {};

  return function (target: InstanceType<IConstructor>, key: string) {
    if (to) ToJSON(to)(target, key);
    if (from) FromJSON(from)(target, key);
  };
}

/**
 * 转换为真实的字段名
 * @param fieldName 真实的字段名
 * @injectTarget Properties
 */
export function Field(fieldName?: string | IFieldNameTransformOpts): Function {
  const fieldOpts: IFieldNameTransformOpts = {};

  return function (target: InstanceType<IConstructor>, key: string) {
    if (typeof fieldName !== "object") {
      fieldOpts.from = fieldName || key;
      fieldOpts.to = fieldName || key;
    } else {
      fieldOpts.from = fieldName?.from || key;
      fieldOpts.to = fieldName?.to || key;

      if (fieldName?.type) {
        FieldType(fieldName.type)(target, key);
      }
    }

    Object.defineProperty(target, `__getField__${key.toUpperCase()}`, {
      configurable: false,
      enumerable: false,
      get() {
        return fieldOpts;
      },
    });
  };
}

/**
 * 转换最终结果时会被移除掉，一般用于辅助属性
 * @injectTarget Properties
 */
export function ToIgnore<T = any, K extends keyof T = any>(whenIgnore?: (v: T[K], _: T) => boolean) {
  return function (target: InstanceType<IConstructor>, key: string): any {
    Object.defineProperty(target, `__getIgnore__${key.toUpperCase()}`, {
      configurable: false,
      enumerable: false,
      get() {
        return whenIgnore || (() => true);
      },
    });
  };
}

/**
 * 给属性定义自定义类型，用于嵌套实体回显
 * 自定义嵌套实体必须定义，以便回显的正确性
 * @injectTarget Properties
 */
export function FieldType(type: IConstructor | IConstructor[]) {
  return Reflect.metadata("custom:type", type);
}

/**
 * 将原始数据经过实体类做一次转换得到加工后的数据（通常用于非resolveEntity提取数据直接提交情况）
 * @param Entity 实体类
 * @param k 目标数据的key
 * @injectTarget Method
 * @example
 *
 * class XX {
 *    @ResolveEntityFromData(Student)
 *    set sendData(data) {
 *      // 这里data已被 'ResolveEntityFromData' 处理后的
 *    }
 * }
 */
export function ResolveEntityFromData(Entity: IConstructor, k?: string) {
  return function (target: IDict<any>, key: string, descriptor: PropertyDescriptor) {
    const originSetter = descriptor.set || noop;

    descriptor.set = function (value) {
      const result = resolveEntityFromData(Entity, value, k);

      return originSetter(result);
    };
  };
}
