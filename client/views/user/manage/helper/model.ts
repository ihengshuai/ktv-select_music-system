import { ITableFilter } from "@/typings/common/table";
import { IUserListFilter } from "@/typings/models/user";

export function createUserTableFilters() {
  const filters: ITableFilter<IUserListFilter> = {
    level: {
      value: null,
      immediate: true,
    },
    status: {
      value: null,
      immediate: true,
    },
    keywords: {
      value: null,
    },
  };

  return filters;
}
