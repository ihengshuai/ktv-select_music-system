import { EnumUtils } from "@hengshuai/helper";

export function getEnumOptions<T>(enumEntity: T, isAll = false) {
  const opts = EnumUtils.getEntries<T>(enumEntity).map(l => ({
    ...l,
    label: l.alias,
  }));

  if (isAll) {
    // @ts-ignore
    opts.unshift(enumAllOpts);
  }

  return opts;
}

export const enumAllOpts: any = {
  label: "全部",
  value: null,
};
