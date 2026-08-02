import { Button, message, Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";

import { MusicStyleController } from "@/api/music/music-style";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { useTablePage } from "@/hooks";
import { IListQuery, IOperation } from "@/typings/common/table";
import { IMusicStyleVO, IQueryMusicStyleDTO } from "@/typings/models/music/music-style";

import { createMusicStyleColumns, createStyleTableFilter } from "../../helper";
import CreateStyleDrawer from "./widgets/create-style-drawer";
import StyleSearch from "./widgets/style-search";
import UpdateStyleDrawer from "./widgets/update-style-drawer";

interface ITableActionState {
  showCreateDrawer: boolean;
  showUpdateDrawer: boolean;
  updateColumn: IMusicStyleVO | null;
}

const MusicStylePage = defineComponent({
  name: "MusicStylePage",
  setup() {
    const styleCtor = new MusicStyleController();

    const filters = reactive(createStyleTableFilter());
    const columns = createMusicStyleColumns();

    const { tableProps, onSearch, resetSearch, refresh } = useTablePage({
      columns,
      filters,
      traceMode: "replace",
      fetchData: getStyleList,
    });

    const tableActionState = reactive<ITableActionState>({
      showCreateDrawer: false,
      showUpdateDrawer: false,
      updateColumn: null,
    });

    const operations: IOperation<IMusicStyleVO>[] = [
      {
        key: TABLE_OPERATION.UPDATE,
        value: "编辑",
        buttonProps: {
          type: "link",
        },
        handler: ({ record }) => {
          tableActionState.showUpdateDrawer = true;
          tableActionState.updateColumn = JSON.parse(JSON.stringify(record));
        },
      },
      {
        key: TABLE_OPERATION.DELETE,
        value: "删除",
        buttonProps: {
          type: "link",
          danger: true,
        },
        handler: ({ record }) => onClickDeleteBtn(record),
      },
    ];

    function onClickCreateBtn() {
      tableActionState.showCreateDrawer = true;
    }

    function onClickDeleteBtn(payload: IMusicStyleVO) {
      Modal.confirm({
        title: "删除风格",
        content: "确定要删除该风格吗？",
        onOk: async () => {
          await styleCtor.removeMusicStyle(payload.id);

          message.success("删除成功");
          refresh();
        },
      });
    }

    function onDrawerSuccess() {
      tableActionState.showCreateDrawer = false;
      tableActionState.showUpdateDrawer = false;
      tableActionState.updateColumn = null;

      refresh();
    }

    function onCloseDrawer() {
      tableActionState.showCreateDrawer = false;
      tableActionState.showUpdateDrawer = false;
      tableActionState.updateColumn = null;
    }

    async function getStyleList(query: IListQuery<IQueryMusicStyleDTO>) {
      return styleCtor.getStyleList(query);
    }

    return () => {
      const PanelAction = () => (
        <>
          <Button
            type="primary"
            onClick={onClickCreateBtn}
          >
            新建
          </Button>
        </>
      );

      return (
        <IPanel
          title={
            <StyleSearch
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

          <CreateStyleDrawer
            visible={tableActionState.showCreateDrawer}
            onSuccess={onDrawerSuccess}
            onClose={onCloseDrawer}
          />

          <UpdateStyleDrawer
            column={tableActionState.updateColumn}
            visible={tableActionState.showUpdateDrawer}
            onSuccess={onDrawerSuccess}
            onClose={onCloseDrawer}
          />
        </IPanel>
      );
    };
  },
});

export default MusicStylePage;
