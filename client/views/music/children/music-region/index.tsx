import { Button, message, Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";

import { MusicRegionController } from "@/api/music/music-region";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { useTablePage } from "@/hooks";
import { IListQuery, IOperation } from "@/typings/common/table";
import { IMusicRegionVO, IQueryMusicRegionDTO } from "@/typings/models/music/music-region";

import { createMusicRegionColumns, createRegionTableFilter } from "../../helper";
import CreateRegionDrawer from "./widgets/create-region-drawer";
import RegionSearch from "./widgets/region-search";
import UpdateRegionDrawer from "./widgets/update-region-drawer";

interface ITableActionState {
  showCreateDrawer: boolean;
  showUpdateDrawer: boolean;
  updateColumn: IMusicRegionVO | null;
}

const MusicRegionPage = defineComponent({
  name: "MusicRegionPage",
  setup() {
    const regionCtor = new MusicRegionController();

    const filters = reactive(createRegionTableFilter());
    const columns = createMusicRegionColumns();

    const { tableProps, onSearch, resetSearch, refresh } = useTablePage({
      columns,
      filters,
      traceMode: "replace",
      fetchData: getRegionList,
    });

    const tableActionState = reactive<ITableActionState>({
      showCreateDrawer: false,
      showUpdateDrawer: false,
      updateColumn: null,
    });

    const operations: IOperation<IMusicRegionVO>[] = [
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

    function onClickDeleteBtn(payload: IMusicRegionVO) {
      Modal.confirm({
        title: "删除地区",
        content: "确定要删除该地区吗？",
        onOk: async () => {
          await regionCtor.removeRegionStyle(payload.id);

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

    async function getRegionList(query: IListQuery<IQueryMusicRegionDTO>) {
      return regionCtor.getRegionList(query);
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
            <RegionSearch
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

          <CreateRegionDrawer
            visible={tableActionState.showCreateDrawer}
            onSuccess={onDrawerSuccess}
            onClose={onCloseDrawer}
          />

          <UpdateRegionDrawer
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

export default MusicRegionPage;
