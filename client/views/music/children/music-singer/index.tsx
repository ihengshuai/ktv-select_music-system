import { Button, message, Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";

import { MusicSingerController } from "@/api/music/music-singer";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { useTablePage } from "@/hooks";
import { IListQuery, IOperation } from "@/typings/common/table";
import { IMusicSingerVO, IQueryMusicSingerDTO } from "@/typings/models/music/music-singer";

import { createMusicSingerColumns, createSingerTableFilter } from "../../helper";
import CreateSingerDrawer from "./widgets/create-singer-drawer";
import SingerSearch from "./widgets/singer-search";
import UpdateSingerDrawer from "./widgets/update-singer-drawer";

interface ITableActionState {
  showCreateDrawer: boolean;
  showUpdateDrawer: boolean;
  updateColumn: IMusicSingerVO | null;
}

const MusicSingerPage = defineComponent({
  name: "MusicSingerPage",
  setup() {
    const singerCtor = new MusicSingerController();

    const filters = reactive(createSingerTableFilter());
    const columns = createMusicSingerColumns();

    const { tableProps, onSearch, resetSearch, refresh } = useTablePage({
      columns,
      filters,
      traceMode: "replace",
      fetchData: getSingerList,
    });

    const tableActionState = reactive<ITableActionState>({
      showCreateDrawer: false,
      showUpdateDrawer: false,
      updateColumn: null,
    });

    const operations: IOperation<IMusicSingerVO>[] = [
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

    function onClickDeleteBtn(payload: IMusicSingerVO) {
      Modal.confirm({
        title: "删除歌手",
        content: "确定要删除该歌手吗？",
        onOk: async () => {
          await singerCtor.removeSinger(payload.id);

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

    async function getSingerList(query: IListQuery<IQueryMusicSingerDTO>) {
      return singerCtor.getSingerList(query);
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
            <SingerSearch
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

          <CreateSingerDrawer
            visible={tableActionState.showCreateDrawer}
            onSuccess={onDrawerSuccess}
            onClose={onCloseDrawer}
          />

          <UpdateSingerDrawer
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

export default MusicSingerPage;
