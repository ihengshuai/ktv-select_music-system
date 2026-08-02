import { Button, message, Modal, Space } from "ant-design-vue";
import { defineComponent, reactive } from "vue";

import { EnumCodeController } from "@/api/enum-code";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { useTablePage } from "@/hooks";
import { IListQuery, IOperation } from "@/typings/common/table";
import { IEnumCodeVO, IQueryEnumCodeDTO } from "@/typings/models/enum-code/enum-code";

import { createEnumCodeTableColumn, createEnumCodeTableFilter } from "./helper";
import EnumCodeCreateDrawer from "./widgets/enum-code-create-drawer";
import EnumCodeUpdateDrawer from "./widgets/enum-code-update-drawer";
import EnumCodeSearch from "./widgets/search-panel";

interface IDrawerState {
  updateVisible: boolean;
  updateColumn: IEnumCodeVO | null;
  createVisible: boolean;
}

const EnumCodeManage = defineComponent({
  name: "EnumCodeManage",
  setup() {
    const controller = new EnumCodeController();

    const columns = createEnumCodeTableColumn();
    const filters = createEnumCodeTableFilter();
    const drawerState = reactive<IDrawerState>({
      updateVisible: false,
      updateColumn: null,
      createVisible: false,
    });

    const operations: IOperation<IEnumCodeVO>[] = [
      {
        key: TABLE_OPERATION.UPDATE,
        value: "编辑",
        buttonProps: {
          type: "link",
        },
        handler: ({ record }) => onClickUpdateBtn(record),
      },
      {
        key: TABLE_OPERATION.DELETE,
        value: "删除",
        buttonProps: {
          type: "link",
          danger: true,
        },
        handler: ({ record }) => onClickRemoveBtn(record),
      },
    ];

    const { tableProps, onSearch, resetSearch, refresh } = useTablePage<IEnumCodeVO>({
      columns,
      filters,
      traceMode: "replace",
      fetchData,
    });

    function onClickUpdateBtn(record: IEnumCodeVO) {
      drawerState.updateVisible = true;
      drawerState.updateColumn = record;
    }

    function onUpdateSuccess() {
      drawerState.updateVisible = false;
      drawerState.updateColumn = null;
      drawerState.createVisible = false;
      refresh();
    }

    function onClickCreateBtn() {
      drawerState.createVisible = true;
    }

    function onCloseDrawer() {
      drawerState.updateVisible = false;
      drawerState.updateColumn = null;
      drawerState.createVisible = false;
    }

    function onClickRemoveBtn(record: IEnumCodeVO) {
      Modal.confirm({
        title: "删除枚举项",
        content: `确定要删除枚举项【${record.code}】吗？`,
        onOk: async () => {
          await controller.deleteEnumCode(record.code);

          message.success("删除成功");
          refresh();
        },
      });
    }

    async function fetchData(params?: IListQuery<IQueryEnumCodeDTO>) {
      return controller.getEnumCodeList(params);
    }

    return () => {
      const PanelExtra = () => (
        <Space>
          <Button
            type="primary"
            onClick={onClickCreateBtn}
          >
            新建
          </Button>
        </Space>
      );

      return (
        <IPanel
          title={
            <EnumCodeSearch
              filters={filters}
              onSearch={() => onSearch()}
              onReset={() => resetSearch()}
            />
          }
          extra={<PanelExtra />}
        >
          <ITable
            {...tableProps.value}
            operations={operations}
          />

          <EnumCodeUpdateDrawer
            visible={drawerState.updateVisible}
            column={drawerState.updateColumn!}
            onSuccess={onUpdateSuccess}
            onClose={onCloseDrawer}
          />

          <EnumCodeCreateDrawer
            visible={drawerState.createVisible}
            onSuccess={onUpdateSuccess}
            onClose={onCloseDrawer}
          />
        </IPanel>
      );
    };
  },
});

export default EnumCodeManage;
