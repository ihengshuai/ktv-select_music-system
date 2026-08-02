import { Button, message, Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";

import { MusicTagController } from "@/api/music/music-tag";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { useTablePage } from "@/hooks";
import { IListQuery, IOperation } from "@/typings/common/table";
import { IMusicTagVO, IQueryMusicTagDTO } from "@/typings/models/music/music-tag";

import { createMusicTagColumns, createTagTableFilter } from "../../helper";
import CreateTagDrawer from "./widgets/create-tag-drawer";
import TagSearch from "./widgets/tag-search";
import UpdateTagDrawer from "./widgets/update-tag-drawer";

interface ITableActionState {
  showCreateDrawer: boolean;
  showUpdateDrawer: boolean;
  updateColumn: IMusicTagVO | null;
}

const MusicTagPage = defineComponent({
  name: "MusicTagPage",
  setup() {
    const tagCtor = new MusicTagController();

    const filters = reactive(createTagTableFilter());
    const columns = createMusicTagColumns();

    const { tableProps, onSearch, resetSearch, refresh } = useTablePage({
      columns,
      filters,
      traceMode: "replace",
      fetchData: getTagList,
    });

    const tableActionState = reactive<ITableActionState>({
      showCreateDrawer: false,
      showUpdateDrawer: false,
      updateColumn: null,
    });

    const operations: IOperation<IMusicTagVO>[] = [
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

    function onClickDeleteBtn(payload: IMusicTagVO) {
      Modal.confirm({
        title: "删除标签",
        content: "确定要删除该标签吗？",
        onOk: async () => {
          await tagCtor.removeMusicTag(payload.id);

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

    async function getTagList(query: IListQuery<IQueryMusicTagDTO>) {
      return tagCtor.getTagList(query);
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
            <TagSearch
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

          <CreateTagDrawer
            visible={tableActionState.showCreateDrawer}
            onSuccess={onDrawerSuccess}
            onClose={onCloseDrawer}
          />

          <UpdateTagDrawer
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

export default MusicTagPage;
