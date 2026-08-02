import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

import { OrderController } from "@/api/order/order";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { ROUTE_NAME } from "@/constants/route";
import { useTablePage } from "@/hooks";
import { IListQuery, IOperation, ITableFilter } from "@/typings/common/table";
import { IOrderPayQueryDTO, IOrderPayVO } from "@/typings/models/order/order-pay";

import { createOrderPayColumns, createOrderPayTableFilter } from "../../helper";
import OrderPayTableSearch from "./widgets/order-pay-table-search";

const OrderPayRecordPage = defineComponent({
  name: "OrderPayRecordPage",
  setup() {
    const router = useRouter();
    const orderController = new OrderController();

    const filters = reactive(createOrderPayTableFilter());
    const columns = createOrderPayColumns();
    const pager = reactive<ITableFilter>({
      size: {
        value: null,
        defaultValue: 15,
        type: Number,
        immediate: true,
        validate: v => v >= 1,
        transform: v => v >> 0,
      },
    });

    const { tableProps, onSearch, resetSearch } = useTablePage({
      columns,
      filters,
      pager,
      traceMode: "replace",
      fetchData: getOrderPayList,
    });

    const operations: IOperation<IOrderPayVO>[] = [
      {
        key: TABLE_OPERATION.VIEW,
        value: "订单",
        handler: ({ record }) => {
          router.push({
            name: ROUTE_NAME.orderDetail,
            params: {
              orderNo: record.orderId,
            },
          });
        },
      },
    ];

    async function getOrderPayList(query: IListQuery<IOrderPayQueryDTO>) {
      return orderController.getPayList(query);
    }

    return () => (
      <IPanel
        title={
          <OrderPayTableSearch
            filters={filters}
            onSearch={onSearch}
            onReset={resetSearch}
          />
        }
      >
        <ITable
          {...tableProps.value}
          operations={operations}
        />
      </IPanel>
    );
  },
});

export default OrderPayRecordPage;
