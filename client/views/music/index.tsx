import { Button, message, Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

import { MusicController } from "@/api/music/music";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION, YoN } from "@/constants/common";
import { MUSIC_STATUS } from "@/constants/music";
import { ROUTE_NAME } from "@/constants/route";
import { useTablePage } from "@/hooks";
import { IListQuery, IOperation } from "@/typings/common/table";
import { IMusicVO, IQueryMusicDTO } from "@/typings/models/music/music";

import { createMusicColumns, createMusicTableFilter } from "./helper";
import MusicSearch from "./widgets/music-search";

const MusicManagePage = defineComponent({
  name: "MusicManagePage",
  setup() {
    const router = useRouter();
    const musicController = new MusicController();

    const columns = createMusicColumns();
    const filters = reactive(createMusicTableFilter());

    const operations: IOperation<IMusicVO>[] = [
      {
        key: TABLE_OPERATION.PLAY,
        value: "播放",
        handler: x => {
          console.log(x);
        },
      },
      {
        key: TABLE_OPERATION.TOP,
        value: ({ text }) => <span class="text-amber">{text.recommend === YoN.Y ? "取消推荐" : "加入推荐"}</span>,
        handler: ({ record }) => onClickUpdateMusicRecommendBtn(record),
      },
      {
        key: TABLE_OPERATION.TOGGLE_STATUS,
        value: ({ text }) => (text.status === MUSIC_STATUS.ENABLED ? "下架" : "上架"),
        handler: ({ record }) => onClickUpdateMusicStatusBtn(record),
      },
      {
        key: TABLE_OPERATION.UPDATE,
        value: "编辑",
        handler: ({ record }) => {
          router.push({ name: ROUTE_NAME.musicUpdate, params: { songId: record.uid }, query: { _t: +new Date() } });
        },
      },
      {
        key: TABLE_OPERATION.DELETE,
        value: "删除",
        buttonProps: {
          type: "link",
          danger: true,
        },
        handler: ({ record }) => onClickDeleteMusicBtn(record),
      },
    ];

    const { tableProps, onSearch, resetSearch, refresh } = useTablePage<IMusicVO, IQueryMusicDTO>({
      columns,
      filters,
      pager: {
        size: {
          value: null,
          defaultValue: 15,
          type: Number,
          immediate: true,
          validate: v => v >= 1,
          transform: v => v >> 0,
        },
      },
      traceMode: "replace",
      tableProps: { scroll: { x: 1200 } },
      fetchData: x => loadData(x),
    });

    function onClickCreateMusicBtn() {
      router.push({ name: ROUTE_NAME.musicCreate, query: { _t: +new Date() } });
    }

    async function onClickUpdateMusicStatusBtn(payload: IMusicVO) {
      await musicController.updateMusicStatus(
        payload.uid,
        payload.status === MUSIC_STATUS.ENABLED ? MUSIC_STATUS.DISABLED : MUSIC_STATUS.ENABLED
      );

      message.success("操作成功");
      refresh();
    }

    async function onClickUpdateMusicRecommendBtn(payload: IMusicVO) {
      await musicController.updateMusicRecommend(payload.uid, payload.recommend === YoN.Y ? YoN.N : YoN.Y);

      message.success("操作成功");
      refresh();
    }

    async function onClickDeleteMusicBtn(payload: IMusicVO) {
      Modal.confirm({
        title: "确定要删除当前歌曲吗？",
        onOk: async () => {
          await musicController.removeMusic(payload.uid);

          message.success("删除成功");
          refresh();
        },
      });
    }

    async function loadData(query: IListQuery<IQueryMusicDTO>) {
      return await musicController.getMusicList(query);
    }

    return () => (
      <IPanel
        title={
          <MusicSearch
            filters={filters}
            onSearch={onSearch}
            onReset={resetSearch}
          />
        }
        extra={
          <Button
            type="primary"
            onClick={onClickCreateMusicBtn}
          >
            新增歌曲
          </Button>
        }
      >
        <ITable
          {...tableProps.value}
          operations={operations}
          operateCollapseMin={3}
        />
      </IPanel>
    );
  },
});

export default MusicManagePage;
