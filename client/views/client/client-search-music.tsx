import { ArrowUpOutlined, PlayCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { Empty, Input, Space } from "ant-design-vue";
import { defineComponent, reactive } from "vue";

import { ClientController } from "@/api/client/client.api";
import { MusicController } from "@/api/music/music";
import { useTablePage } from "@/hooks";
import { useMusicPlayerStore } from "@/store";
import { IListQuery, ITableFilter } from "@/typings/common/table";
import { IMusicVO, IQueryMusicDTO } from "@/typings/models/music/music";

interface IMusicState {
  musicList: IMusicVO[];
}

const ClientSearchMusic = defineComponent({
  name: "ClientSearchMusic",
  setup() {
    const c = new ClientController();
    const { play, push } = useMusicPlayerStore();

    const filters = reactive<ITableFilter<IQueryMusicDTO>>({
      keywords: {
        value: null,
      },
    });

    const { dataSource, onSearch } = useTablePage({
      filters,
      columns: [],
      pager: {
        size: {
          value: null,
          defaultValue: 20,
          type: Number,
          immediate: true,
          validate: v => v >= 1,
          transform: v => v >> 0,
        },
      },
      fetchData,
    });

    function playMusic(item: IMusicVO) {
      console.log(item);
      play(item);
    }

    async function fetchData(query: IListQuery<IQueryMusicDTO>) {
      return await c.getMusicList(query);
    }

    return () => (
      <div class="client-search">
        <Input
          v-model:value={filters.keywords!.value}
          onPressEnter={() => onSearch()}
          class="client-search-input"
          placeholder="请输入关键字..."
        />

        <div class="client-search__content">
          {dataSource.value.length ? (
            <ul class="client-search__list">
              {dataSource.value.map((item, i) => (
                <li
                  class="client-search__list-item"
                  key={item.uid}
                >
                  <span class="client-search__list-num">{i}. </span>
                  <span class="client-search__list-title">
                    {item.title} —— {item.singerName}
                  </span>

                  <Space
                    size={18}
                    class="client-search__list-btns"
                  >
                    <PlusOutlined onClick={() => push(item)} />
                    <PlayCircleOutlined onClick={() => playMusic(item)} />
                    <ArrowUpOutlined />
                  </Space>
                </li>
              ))}
            </ul>
          ) : (
            <Empty description="没找到相关音乐" />
          )}
        </div>
      </div>
    );
  },
});

export default ClientSearchMusic;
