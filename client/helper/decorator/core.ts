import "reflect-metadata";
import { createEntity } from "@/entities/tool";
import { IConstructor, IDict } from "@/typings/common/type";

import { IFieldNameTransformOpts } from "./type.d";

/**
 * 创建实体
 * @param target 目标实体类
 * @injectTarget Class
 * @returns 包装后的实体
 */
export function Entity() {
  return function (target: IConstructor): InstanceType<typeof target> {
    return class extends target {
      constructor(args: any = {}) {
        super(args);

        this.initFields(args);
      }

      private get isEntity() {
        return true;
      }

      protected initFields(args = {}) {
        // @ts-expect-error: error
        const isInitialize = args.__initialize__;

        if (isInitialize) this.copyDataToEntity(args);
        else this.transformDataToEntity(args);
      }

      /** 用于初始化（不做数据转换） */
      private copyDataToEntity(args: IDict<any> = {}) {
        Object.keys(this).forEach(k => {
          const fieldName = k;

          if (args.hasOwnProperty(fieldName)) {
            const customType = Reflect.getMetadata("custom:type", this, k);

            if (customType) {
              if (Array.isArray(customType)) {
                const values: any[] = args[fieldName] || [];
                const result: any[] = [];
                let lastCustomFieldEntity = customType[0];

                values.forEach((v, i) => {
                  if (customType[i]) {
                    lastCustomFieldEntity = customType[i];
                  }
                  result.push(createEntity(lastCustomFieldEntity, v));
                });
                this[k] = result;
              } else {
                this[k] = createEntity(customType, args[fieldName]);
              }
            } else {
              this[k] = args[fieldName];
            }
          } else if (this[k] === undefined) {
            this[k] = null;
          }
        });
      }

      /** 用于值的回显（走实体内部转换逻辑） */
      private transformDataToEntity(args: IDict<any> = {}) {
        Object.keys(this).forEach(k => {
          const { from: fieldName } = this.getFieldName(k);

          if (args.hasOwnProperty(fieldName!)) {
            const transformFn = this.getFromJson(k);
            const customType = Reflect.getMetadata("custom:type", this, k);

            if (customType) {
              if (Array.isArray(customType)) {
                const values: any[] = args[fieldName!];
                const result: any[] = [];
                let lastCustomFieldEntity = customType[0];

                values.forEach((v, i) => {
                  if (customType[i]) {
                    lastCustomFieldEntity = customType[i];
                  }
                  result.push(createEntity(lastCustomFieldEntity, v, false));
                });
                this[k] = transformFn(result, args);
              } else {
                this[k] = transformFn(createEntity(customType, args[fieldName!], false), args);
              }
            } else {
              this[k] = transformFn(args[fieldName!], args);
            }
          } else if (this[k] === undefined) {
            this[k] = null;
          }
        });
      }

      /**
       * 转换后的结果值
       * @returns JSON对象值
       */
      protected toJSON() {
        try {
          const res = Object.keys(this).reduce((acc, cur) => {
            if (this.isIgnored(cur)) return acc;

            const transformFn = this.getToJson(cur);
            const { to: fieldName } = this.getFieldName(cur);

            // eslint-disable-next-line no-param-reassign
            acc[fieldName!] = transformFn(this[cur], this);

            return acc;
          }, {} as this);

          return JSON.parse(JSON.stringify(res));
        } catch (error) {
          return JSON.parse(JSON.stringify(this));
        }
      }

      protected getToJson(fieldName: string): (v: any, _: any) => any {
        // eslint-disable-next-line no-unused-vars
        return Reflect.get(this, `__toJSON__${fieldName?.toUpperCase()}`) || ((v: any, _: this) => v);
      }

      protected getFromJson(fieldName: string): (v: any, _: any) => any {
        // eslint-disable-next-line no-unused-vars
        return Reflect.get(this, `__fromJSON__${fieldName?.toUpperCase()}`) || ((v: any, _: this) => v);
      }

      protected getFieldName(fieldName: string): IFieldNameTransformOpts {
        return Reflect.get(this, `__getField__${fieldName?.toUpperCase()}`) || { to: fieldName, from: fieldName };
      }

      protected isIgnored(fieldName: string) {
        const toIgnore = Reflect.get(this, `__getIgnore__${fieldName?.toUpperCase()}`);

        if (typeof toIgnore === "function") {
          return toIgnore(this[fieldName], this);
        }

        return false;
      }
    };
  };
}
