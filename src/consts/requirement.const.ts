/** 需求状态 */
export enum REQUIREMENT_STATUS {
  /** 未开始 */
  NOT_START = "NOT_START",
  /** 进行中 */
  INPROGRESS = "INPROGRESS",
  /** 暂停 */
  PAUSED = "PAUSED",
  /** 完成 */
  FINISHED = "FINISHED",
  /** 延迟 */
  DELAYED = "DELAYED",
  /** 取消 */
  CANCELED = "CANCELED",
}

/** 需求支付状态 */
export enum REQUIREMENT_PAY_STATUS {
  /** 未支付 */
  NOT_PAID = "NOT_PAID",
  /** 部分支付 */
  PART_PAID = "PART_PAID",
  /** 已支付 */
  PAID = "PAID",
  /** 退款中 */
  REFUNDING = "REFUNDING",
  /** 退款成功 */
  REFUNDED = "REFUNDED",
  /** 退款失败 */
  REFUND_FAILED = "REFUND_FAILED",
  /** 退款取消 */
  REFUND_CANCELED = "REFUND_CANCELED",
  /** 退款拒绝 */
  REFUND_REJECTED = "REFUND_REJECTED",
  /** 退款异常 */
  REFUND_EXCEPTION = "REFUND_EXCEPTION",
}
