import { Button, Form, Input, Select, Space } from "ant-design-vue";
import { defineComponent, PropType } from "vue";

import { ORDER_PAY_TYPE } from "@/constants/order";
import { getEnumOptions } from "@/helper";
import { ITableFilter } from "@/typings/common/table";
import { IOrderPayQueryDTO } from "@/typings/models/order/order-pay";

const OrderPayTableSearch = defineComponent({
  name: "OrderPayTableSearch",
  props: {
    filters: {
      type: Object as PropType<ITableFilter<IOrderPayQueryDTO>>,
      required: true,
    },
  },
  emits: ["search", "reset"],
  setup(props, { emit }) {
    const orderPayTypeOpts = getEnumOptions(ORDER_PAY_TYPE, true);

    return () => (
      <Form class="table-form">
        <Space
          wrap
          class="py-4"
        >
          <Form.Item label="订单号">
            <Input
              v-model:value={props.filters.orderId!.value}
              allowClear
              class="w-200"
              placeholder="订单号"
              onPressEnter={() => emit("search")}
            />
          </Form.Item>

          <Form.Item label="收支类型">
            <Select
              v-model:value={props.filters.type!.value}
              allowClear
              class="w-200"
              placeholder="收支类型"
              options={orderPayTypeOpts}
            />
          </Form.Item>

          <Button
            type="link"
            size="small"
            onClick={() => emit("search")}
          >
            搜索
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => emit("reset")}
          >
            重置
          </Button>
        </Space>
      </Form>
    );
  },
});

export default OrderPayTableSearch;
