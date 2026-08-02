import { setMetadata } from "@hengshuai/helper";

/**
 * 订单支付状态
 */
export enum ORDER_PAY_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
}

setMetadata(ORDER_PAY_STATUS, {
  PENDING: {
    alias: "待支付",
  },
  PAID: {
    alias: "已支付",
  },
  CANCELED: {
    alias: "取消",
  },
  FAILED: {
    alias: "支付失败",
  },
});

/**
 * 订单使用状态
 */
export enum ORDER_USE_STATUS {
  /** 未使用 */
  NOT_USED = "NOT_USED",
  /** 已使用 */
  USED = "USED",
}

setMetadata(ORDER_USE_STATUS, {
  NOT_USED: {
    alias: "未使用",
  },
  USED: {
    alias: "已使用",
  },
});

/** 订单有效期状态 */
export enum ORDER_VALIDITY_STATUS {
  /** 正常 */
  NORMAL = "NORMAL",
  /** 过期 */
  EXPIRED = "EXPIRED",
}

setMetadata(ORDER_VALIDITY_STATUS, {
  NORMAL: {
    alias: "正常",
  },
  EXPIRED: {
    alias: "过期",
  },
});

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

setMetadata(ORDER_OPERATION, {
  ORDER: {
    alias: "下单",
  },
  ONLINE: {
    alias: "上线",
  },
  OFFLINE: {
    alias: "下线",
  },
  OFFLINE_REFUND: {
    alias: "下线退款",
  },
  FORCE_OFFLINE: {
    alias: "强制下线",
  },
  RENEW: {
    alias: "续费",
  },
});

/** 支付类型 */
export enum ORDER_PAY_TYPE {
  /** 支出 */
  OUT = "OUT",
  /** 收入 */
  IN = "IN",
}

setMetadata(ORDER_PAY_TYPE, {
  OUT: {
    alias: "支出",
  },
  IN: {
    alias: "收入",
  },
});
