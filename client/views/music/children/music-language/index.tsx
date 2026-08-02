import { Button, message, Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";

import { MusicLanguageController } from "@/api/music/music-language";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { useTablePage } from "@/hooks";
import { IListQuery, IOperation } from "@/typings/common/table";
import { IMusicLanguageVO, IQueryMusicLanguageDTO } from "@/typings/models/music/music-language";

import { createLanguageTableFilter, createMusicLanguageColumns } from "../../helper";
import CreateLanguageDrawer from "./widgets/create-language-drawer";
import LanguageSearch from "./widgets/language-search";
import UpdateLanguageDrawer from "./widgets/update-language-drawer";

interface ITableActionState {
  showCreateDrawer: boolean;
  showUpdateDrawer: boolean;
  updateColumn: IMusicLanguageVO | null;
}

const MusicLanguagePage = defineComponent({
  name: "MusicLanguagePage",
  setup() {
    const languageCtor = new MusicLanguageController();

    const filters = reactive(createLanguageTableFilter());
    const columns = createMusicLanguageColumns();

    const { tableProps, onSearch, resetSearch, refresh } = useTablePage({
      columns,
      filters,
      traceMode: "replace",
      fetchData: getLanguageList,
    });

    const tableActionState = reactive<ITableActionState>({
      showCreateDrawer: false,
      showUpdateDrawer: false,
      updateColumn: null,
    });

    const operations: IOperation<IMusicLanguageVO>[] = [
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

    function onClickDeleteBtn(payload: IMusicLanguageVO) {
      Modal.confirm({
        title: "删除语种",
        content: "确定要删除该语种吗？",
        onOk: async () => {
          await languageCtor.removeMusicLanguage(payload.id);

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

    async function getLanguageList(query: IListQuery<IQueryMusicLanguageDTO>) {
      return languageCtor.getLanguageList(query);
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
            <LanguageSearch
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

          <CreateLanguageDrawer
            visible={tableActionState.showCreateDrawer}
            onSuccess={onDrawerSuccess}
            onClose={onCloseDrawer}
          />

          <UpdateLanguageDrawer
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

export default MusicLanguagePage;
