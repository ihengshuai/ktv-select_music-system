import { Button, InputPassword, message, Modal } from "ant-design-vue";
import md5 from "md5";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

import { OrderController } from "@/api/order/order";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { ORDER_VALIDITY_STATUS } from "@/constants/order";
import { ROUTE_NAME } from "@/constants/route";
import { BusinessValidationException } from "@/helper/exception";
import { useTablePage } from "@/hooks";
import { IListQuery, IOperation, ITableFilter } from "@/typings/common/table";
import { IOrderQueryDTO, IOrderVO } from "@/typings/models/order/order";

import { createOrderColumns, createOrderTableFilter } from "./helper";
import OrderCreateDrawer from "./widgets/order-create-drawer";
import OrderSearch from "./widgets/order-search";

const OrderListPage = defineComponent({
  name: "OrderListPage",
  setup() {
    const router = useRouter();

    const orderController = new OrderController();
    const columns = createOrderColumns();
    const filters = reactive(createOrderTableFilter());
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

    const { tableProps, refresh, onSearch, resetSearch } = useTablePage({
      filters,
      columns,
      pager,
      tableProps: { scroll: { x: 1200 } },
      traceMode: "replace",
      fetchData: getOrderList,
    });

    const operations: IOperation<IOrderVO>[] = [
      {
        key: TABLE_OPERATION.VIEW,
        value: "详细",
        handler: ({ record }) => {
          router.push({
            name: ROUTE_NAME.orderDetail,
            params: {
              orderNo: record.orderNo,
            },
          });
        },
      },
      {
        key: TABLE_OPERATION.RENEW,
        validator: ({ record }) => record.validityStatus !== ORDER_VALIDITY_STATUS.EXPIRED,
        value: () => <span class="color-amber">续费</span>,
        handler: ({ record }) => {
          drawerState.record = record;
          drawerState.visible = true;
        },
      },
      {
        key: TABLE_OPERATION.FORCE_OFFLINE,
        value: "结账下机",
        validator: ({ record }) => record.validityStatus !== ORDER_VALIDITY_STATUS.EXPIRED,
        buttonProps: { danger: true },
        handler: ({ record }) => onClickTerminateBtn(record),
      },
    ];

    const drawerState = reactive({
      visible: false,
      record: null as IOrderVO | null,
      forceOfflineVisible: false,
      forceOfflineLoading: false,
      forceOfflineOperatorPassword: null,
    });

    function onClickCreateOrderBtn() {
      drawerState.visible = true;
    }

    function onSuccess() {
      refresh();

      onCloseDrawer();
    }

    function onCloseDrawer() {
      drawerState.visible = false;
      drawerState.record = null;
      drawerState.forceOfflineVisible = false;
      drawerState.forceOfflineLoading = false;
      drawerState.forceOfflineOperatorPassword = null;
    }

    async function getOrderList(query: IListQuery<IOrderQueryDTO>) {
      return orderController.getOrderList(query);
    }

    function onClickTerminateBtn(record: IOrderVO) {
      Modal.confirm({
        title: "确定要结账下机吗？",
        onOk: () => {
          drawerState.record = record;
          drawerState.forceOfflineVisible = true;
        },
      });
    }

    async function onForceOfflineSubmit() {
      if (!drawerState.forceOfflineOperatorPassword) {
        message.error("请输入管理员密码");
        throw new BusinessValidationException("请输入管理员密码");
      }

      try {
        drawerState.forceOfflineLoading = true;
        await orderController.forceOffline({
          orderNo: drawerState.record!.orderNo,
          operatorPassword: md5(drawerState.forceOfflineOperatorPassword!),
        });

        message.success("操作成功");

        refresh();
        onCloseDrawer();
      } finally {
        drawerState.forceOfflineLoading = false;
      }
    }

    return () => {
      const PanelAction = () => (
        <>
          <Button
            type="primary"
            onClick={onClickCreateOrderBtn}
          >
            下单
          </Button>
        </>
      );

      return (
        <IPanel
          title={
            <OrderSearch
              filters={filters}
              onSearch={onSearch}
              onReset={resetSearch}
            />
          }
          extra={<PanelAction />}
        >
          <ITable
            {...tableProps.value}
            operations={operations}
          />

          <OrderCreateDrawer
            visible={drawerState.visible}
            orderDetail={drawerState.record!}
            onSuccess={onSuccess}
            onClose={onCloseDrawer}
          />

          <Modal
            title="密码"
            open={drawerState.forceOfflineVisible}
            closable={false}
            maskClosable={false}
            confirmLoading={drawerState.forceOfflineLoading}
            destroyOnClose
            onCancel={onCloseDrawer}
            onOk={onForceOfflineSubmit}
          >
            <InputPassword
              v-model:value={drawerState.forceOfflineOperatorPassword}
              placeholder="请输入管理员密码"
            />
          </Modal>
        </IPanel>
      );
    };
  },
});

export default OrderListPage;
