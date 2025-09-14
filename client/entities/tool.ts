import { IConstructor, IDict } from "@/typings/common/type";
import { deepCopy } from "@/util";

/**
 * 创建实体
 * @param Entity 目标实体类
 * @param initValue? 初始化值
 * @param __initialize__? 是否初始化(初始化不执行实体内部逻辑，直接赋值)
 * @returns 实体
 */
export function createEntity<T extends IConstructor>(
  Entity: T,
  initValue: Partial<InstanceType<T>> = {},
  __initialize__ = true
): InstanceType<T> {
  return new Entity({ ...initValue, __initialize__ });
}

/**
 * 转换后的实体
 * @param Entity 目标实体
 * @param value 待转换的对象
 * @param prop 待转换对象的某个属性
 */
export function createEntityFromData(Entity: IConstructor, value: IDict, prop?: string): InstanceType<typeof Entity> {
  const val = deepCopy(value);

  const data = prop ? val[prop] : val;

  const entity = createEntity(Entity, data);

  return entity;
}

/**
 * 获取实体值
 * @param entity 实体
 * @returns 实体值
 */
export function resolveEntity<T extends IDict<any>>(entity: T): typeof entity {
  if (!entity || !entity?.isEntity) return entity;
  return entity?.toJSON?.() || entity;
}

/**
 * 经过实体转换后的值（用于从某个对象中提取实体并经过实体转换后得到的新对象）
 * @param Entity 目标实体
 * @param value 转换的对象
 * @param prop 转换的对象属性
 */
export function resolveEntityFromData(Entity: IConstructor, value: IDict, prop?: string) {
  const val = deepCopy(value);

  const entity = createEntityFromData(Entity, value, prop);

  const entityResult = resolveEntity(entity);

  if (prop) {
    val[prop] = { ...entityResult };
  } else {
    Object.keys(entity).forEach(prop => delete val[prop]);

    Object.assign(val, entityResult);
  }

  return val;
}

/**
 * 判断对象是不是一个实体对象
 * @param entity 目标对象
 */
export function isEntity(entity: any) {
  return entity?.isEntity === true;
}
