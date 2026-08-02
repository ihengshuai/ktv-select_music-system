/**
 * 订单支付状态
 */
export enum ORDER_PAY_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
}

/**
 * 订单使用状态
 */
export enum ORDER_USE_STATUS {
  /** 未使用 */
  NOT_USED = "NOT_USED",
  /** 已使用 */
  USED = "USED",
}

/** 订单有效期状态 */
export enum ORDER_VALIDITY_STATUS {
  /** 正常 */
  NORMAL = "NORMAL",
  /** 过期 */
  EXPIRED = "EXPIRED",
}

/** 订单操作记录类型 */
export enum ORDER_OPERATION {
  /** 下单 */
  ORDER = "ORDER",
  /** 上线 */
  ONLINE = "ONLINE",
  /** 下线 */
  OFFLINE = "OFFLINE",
  /** 下线退款  */
  OFFLINE_REFUND = "OFFLINE_REFUND",
  /** 强制下线(管理员强制下机) */
  FORCE_OFFLINE = "FORCE_OFFLINE",
  /** 续费 */
  RENEW = "RENEW",
}

/** 支付类型 */
export enum ORDER_PAY_TYPE {
  /** 支出 */
  OUT = "OUT",
  /** 收入 */
  IN = "IN",
}
