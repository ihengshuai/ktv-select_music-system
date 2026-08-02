export enum HTTP_DATA_TYPE {
  FORM = "form",
  JSON = "json",
  FORMDATA = "form-data",
}

export enum HTTP_CODE {
  /**
   * 系统未初始化
   */
  SYSTEM_NOT_INIT = 1001,
  NOT_FOUND = 404,
}

/** 并发状态 */
export enum CONCURRENCY_STATUS {
  PENDING = "pending",
  END = "end",
}
