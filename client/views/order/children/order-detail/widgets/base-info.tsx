import { SyncOutlined } from "@ant-design/icons-vue";
import { Descriptions, Spin } from "ant-design-vue";
import { defineComponent, SlotsType } from "vue";
import { JSX } from "vue/jsx-runtime";

import { OrderController } from "@/api/order/order";
import IPanel from "@/components/common/panel";
import { DateFormat } from "@/constants/date";
import { ORDER_PAY_STATUS, ORDER_USE_STATUS, ORDER_VALIDITY_STATUS } from "@/constants/order";
import { getEnumEntity } from "@/helper";
import { useSingleRequest } from "@/hooks";
import { formatDate } from "@/util";

const Slots = Object as SlotsType<{
  title?: () => JSX.Element;
}>;

const OrderBaseInfo = defineComponent({
  name: "OrderBaseInfo",
  props: {
    orderNo: {
      type: String,
      required: true,
    },
  },
  slots: Slots,
  setup(props, { slots }) {
    const controller = new OrderController();

    const { state, refresh } = useSingleRequest(loadData);

    async function loadData() {
      return await controller.getOrderDetail(props.orderNo);
    }

    return () => (
      <Spin spinning={state.loading}>
        <IPanel
          title={slots.title?.() || "基本信息"}
          extra={<SyncOutlined onClick={() => refresh()} />}
        >
          <Descriptions
            column={2}
            colon
          >
            <Descriptions.Item label="订单号">{state.data?.orderNo}</Descriptions.Item>
            <Descriptions.Item label="订单状态">
              {getEnumEntity(ORDER_VALIDITY_STATUS, state.data?.validityStatus).alias}
            </Descriptions.Item>

            <Descriptions.Item label="使用状态">
              {getEnumEntity(ORDER_USE_STATUS, state.data?.useStatus).alias}
            </Descriptions.Item>
            <Descriptions.Item label="支付状态">
              {getEnumEntity(ORDER_PAY_STATUS, state.data?.payStatus).alias}
            </Descriptions.Item>

            <Descriptions.Item label="时长">{state.data?.longTime}小时</Descriptions.Item>
            <Descriptions.Item label="上机时间">{state.data?.startTime || "-"}</Descriptions.Item>

            <Descriptions.Item label="下单者">{state.data?.createAt}</Descriptions.Item>
            <Descriptions.Item label="更新者">{state.data?.updateAt}</Descriptions.Item>

            <Descriptions.Item label="下单时间">
              {formatDate(state.data!.createTime, DateFormat.DATE_FULLTIME)}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {formatDate(state.data!.updateTime, DateFormat.DATE_FULLTIME)}
            </Descriptions.Item>

            <Descriptions.Item label="密码">{state.data?.password}</Descriptions.Item>
          </Descriptions>
        </IPanel>
      </Spin>
    );
  },
});

export default OrderBaseInfo;
