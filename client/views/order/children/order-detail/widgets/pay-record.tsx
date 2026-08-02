import { SyncOutlined } from "@ant-design/icons-vue";
import { computed, defineComponent } from "vue";

import { OrderController } from "@/api/order/order";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { useTablePage } from "@/hooks";
import { IListQuery } from "@/typings/common/table";
import { IOrderPayQueryDTO } from "@/typings/models/order/order-pay";
import { createOrderPayColumns } from "@/views/order/helper";

const OrderPayRecord = defineComponent({
  name: "OrderPayRecord",
  props: {
    orderNo: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const controller = new OrderController();

    const columns = createOrderPayColumns();

    const { tableProps, dataSource, onSearch } = useTablePage({
      columns,
      pager: {
        size: { defaultValue: 100, value: null },
      },
      trace: false,
      fetchData: loadData,
    });
    const payTotal = computed(() => dataSource.value.reduce((total, item) => total + Number(item.amount), 0));

    async function loadData(params: IListQuery<IOrderPayQueryDTO>) {
      return await controller.getPayList({ ...params, orderId: props.orderNo });
    }

    return () => (
      <IPanel
        title={
          <>
            <span>支付记录</span>
            <span class="color-red-6 ml-8">(总共消费：{payTotal.value}元)</span>
          </>
        }
        extra={<SyncOutlined onClick={() => onSearch()} />}
      >
        <ITable
          {...tableProps.value}
          pagination={false}
        />
      </IPanel>
    );
  },
});

export default OrderPayRecord;
