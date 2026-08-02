import { SyncOutlined } from "@ant-design/icons-vue";
import { defineComponent } from "vue";

import { OrderController } from "@/api/order/order";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { useTablePage } from "@/hooks";
import { IListQuery } from "@/typings/common/table";
import { IOrderOperationQueryDTO } from "@/typings/models/order/order-operation";
import { createOrderOperationColumns } from "@/views/order/helper";

const OrderOperationRecord = defineComponent({
  name: "OrderOperationRecord",
  props: {
    orderNo: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const controller = new OrderController();

    const columns = createOrderOperationColumns();

    const { tableProps, onSearch } = useTablePage({
      columns,
      pager: {
        size: { defaultValue: 100, value: null },
      },
      trace: false,
      fetchData: loadData,
    });

    async function loadData(params: IListQuery<IOrderOperationQueryDTO>) {
      return await controller.getOrderOperationList({ ...params, orderId: props.orderNo });
    }

    return () => (
      <IPanel
        title="操作记录"
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

export default OrderOperationRecord;
