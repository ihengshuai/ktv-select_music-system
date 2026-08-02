import { PaginationDTO } from "@/dto/base-pagination.dto";

import { BaseResponseVO } from "./base-response.vo";

interface IListResultVO<T> {
  items: T[];
  pager: PaginationDTO;
}

export class BaseListResponseVO<T> extends BaseResponseVO<IListResultVO<T>> {
  constructor(code: number, items: T[], pager: PaginationDTO) {
    super(code, { items, pager });
  }

  static success<T = unknown>(items: T[], pager: PaginationDTO) {
    return new BaseListResponseVO<T>(200, items, pager);
  }
}
