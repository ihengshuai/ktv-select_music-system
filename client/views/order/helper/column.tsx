import { Tag } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";

import {
  ORDER_OPERATION,
  ORDER_PAY_STATUS,
  ORDER_PAY_TYPE,
  ORDER_USE_STATUS,
  ORDER_VALIDITY_STATUS,
} from "@/constants/order";
import { getEnumEntity } from "@/helper";
import { IOrderVO } from "@/typings/models/order/order";
import { IOrderOperationVO } from "@/typings/models/order/order-operation";
import { IOrderPayVO } from "@/typings/models/order/order-pay";

export function createOrderColumns() {
  const columns: ColumnsType<IOrderVO> = [
    {
      title: "订单号",
      dataIndex: "orderNo",
      key: "orderNo",
      width: 160,
    },

    {
      title: "使用状态",
      dataIndex: "useStatus",
      width: 120,
      customRender: ({ value }) => (
        <span style={`color:${value === ORDER_USE_STATUS.NOT_USED ? "var(--color-placeholder)" : "var(--color-text)"}`}>
          {getEnumEntity(ORDER_USE_STATUS, value).alias}
        </span>
      ),
    },

    {
      title: "支付状态",
      dataIndex: "payStatus",
      width: 120,
      customRender: ({ value }) => getEnumEntity(ORDER_PAY_STATUS, value).alias,
    },

    {
      title: "有效状态",
      dataIndex: "validityStatus",
      width: 120,
      customRender: ({ value }) => (
        <Tag color={value === ORDER_VALIDITY_STATUS.NORMAL ? "green-inverse" : "orange"}>
          {getEnumEntity(ORDER_VALIDITY_STATUS, value).alias}
        </Tag>
      ),
    },

    {
      title: "开始时间",
      dataIndex: "startTime",
      width: 160,
      customRender: ({ value }) => value || "-",
    },

    {
      title: "时长",
      dataIndex: "longTime",
      width: 140,
      customRender: ({ value }) => `${value.toFixed(1)} 小时`,
    },

    {
      title: "创建人",
      dataIndex: "createAt",
      width: 160,
    },

    {
      title: "更新人",
      dataIndex: "updateAt",
      width: 160,
    },
    {
      title: "操作",
      key: "operation",
      fixed: "right",
      width: 200,
      align: "center",
    },
  ];

  return columns;
}

export function createOrderPayColumns() {
  const columns: ColumnsType<IOrderPayVO> = [
    {
      title: "订单号",
      dataIndex: "orderId",
      key: "orderId",
      width: 130,
    },

    {
      title: "单价",
      dataIndex: "price",
      width: 120,
      customRender: ({ value }) => `${value.toFixed(2)} 元`,
    },

    {
      title: "时长",
      dataIndex: "longTime",
      width: 180,
      customRender: ({ value }) => `${value.toFixed(2)} 小时`,
    },

    {
      title: "金额",
      dataIndex: "amount",
      width: 180,
      customRender: ({ value }) => `${value.toFixed(2)} 元`,
    },

    {
      title: "收支类型",
      dataIndex: "type",
      width: 120,
      customRender: ({ value }) => (
        <Tag color={value === ORDER_PAY_TYPE.IN ? "green" : "red"}>{getEnumEntity(ORDER_PAY_TYPE, value).alias}</Tag>
      ),
    },

    {
      title: "备注",
      dataIndex: "remark",
    },

    {
      title: "付费时间",
      dataIndex: "createTime",
    },
  ];

  return columns;
}

export function createOrderOperationColumns() {
  const columns: ColumnsType<IOrderOperationVO> = [
    {
      title: "订单号",
      dataIndex: "orderId",
      key: "orderId",
      width: 220,
    },

    {
      title: "操作时间",
      dataIndex: "createTime",
      width: 200,
    },

    {
      title: "操作类型",
      dataIndex: "operation",
      width: 200,
      customRender: ({ value }) => getEnumEntity(ORDER_OPERATION, value).alias,
    },

    {
      title: "操作备注",
      dataIndex: "remark",
    },
  ];

  return columns;
}
