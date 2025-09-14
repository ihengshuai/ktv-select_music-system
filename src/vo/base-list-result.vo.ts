import { PaginationDTO } from "@/dto/base-pagination.dto";

const pagination = new PaginationDTO();

export class BaseListResultVO<T> {
  /**
   * 列表数据
   */
  items: T[] = [];

  pager = {
    /**
     * 总数
     */
    total: pagination.total,

    /**
     * 当前页
     */
    page: pagination.page,

    /**
     * 每页条数
     */
    size: pagination.size,
  };

  constructor(items: T[], pager: PaginationDTO) {
    this.items = items;
    Object.assign(this.pager, pager);
  }

  static from<T = any>(items: T[], pager: PaginationDTO) {
    return new BaseListResultVO<T>(items, pager);
  }
}
