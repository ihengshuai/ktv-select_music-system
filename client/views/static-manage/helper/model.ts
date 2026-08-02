import { ITableFilter } from "@/typings/common/table";
import { IStaticQueryDTO } from "@/typings/models/static/static";

export function createStaticTableFilters() {
  const filters: ITableFilter<IStaticQueryDTO> = {
    location: {
      value: null,
      immediate: true,
    },
    type: {
      value: null,
      immediate: true,
    },
    keywords: {
      value: null,
    },
  };

  return filters;
}
