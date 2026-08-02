import { Button, DatePicker, Form, Input, Select, Space } from "ant-design-vue";
import { defineComponent, PropType } from "vue";

import { DateFormat } from "@/constants/date";
import { ORDER_USE_STATUS, ORDER_VALIDITY_STATUS } from "@/constants/order";
import { getEnumOptions } from "@/helper";
import { ITableFilter } from "@/typings/common/table";
import { IOrderQueryDTO } from "@/typings/models/order/order";

const OrderSearch = defineComponent({
  name: "OrderSearch",
  props: {
    filters: {
      type: Object as PropType<ITableFilter<IOrderQueryDTO>>,
      required: true,
    },
  },
  emits: ["search", "reset"],
  setup(props, { emit }) {
    const orderStatusOpts = getEnumOptions(ORDER_VALIDITY_STATUS);
    const orderUseStatusOpts = getEnumOptions(ORDER_USE_STATUS);

    return () => (
      <Form class="table-form">
        <Space
          wrap
          class="py-4"
        >
          <Form.Item label="状态">
            <Select
              v-model:value={props.filters.validityStatus!.value}
              options={orderStatusOpts}
              allowClear
              placeholder="订单状态"
              class="w-120"
            />
          </Form.Item>

          <Form.Item label="使用状态">
            <Select
              v-model:value={props.filters.useStatus!.value}
              options={orderUseStatusOpts}
              allowClear
              placeholder="使用状态"
              class="w-120"
            />
          </Form.Item>

          <Form.Item label="下单时间">
            <DatePicker
              v-model:value={props.filters.createTime!.value}
              allowClear
              show-time
              format={DateFormat.DATETIME}
              valueFormat={DateFormat.DATE_FULLTIME}
              placeholder="下单时间"
              class="w-160"
            />
          </Form.Item>

          <Form.Item>
            <Input
              v-model:value={props.filters.orderNo.value}
              allowClear
              class="w-200"
              placeholder="订单号"
              onPressEnter={() => emit("search")}
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

export default OrderSearch;
