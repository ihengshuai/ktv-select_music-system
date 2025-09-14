import { EnumUtils } from "@hengshuai/helper";

export function getEnumEntity<T>(enumEntity: T, value: any) {
  const entity = EnumUtils.getEntry(value, enumEntity) || {};

  return entity;
}
