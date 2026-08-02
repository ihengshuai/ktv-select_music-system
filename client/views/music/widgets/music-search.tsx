import { Button, Form, Input, Select, Space } from "ant-design-vue";
import { defineComponent, PropType, reactive } from "vue";
import { useI18n } from "vue-i18n";

import { MusicLanguageController } from "@/api/music/music-language";
import { MusicRegionController } from "@/api/music/music-region";
import { MusicSingerController } from "@/api/music/music-singer";
import { MusicStyleController } from "@/api/music/music-style";
import { MusicTagController } from "@/api/music/music-tag";
import { YoN } from "@/constants/common";
import { MUSIC_STATUS } from "@/constants/music";
import { getEnumOptions } from "@/helper";
import { ITableFilter } from "@/typings/common/table";
import { IQueryMusicDTO } from "@/typings/models/music/music";
import { IMusicLanguageVO } from "@/typings/models/music/music-language";
import { IMusicRegionVO } from "@/typings/models/music/music-region";
import { IMusicSingerVO } from "@/typings/models/music/music-singer";
import { IMusicStyleVO } from "@/typings/models/music/music-style";
import { IMusicTagVO } from "@/typings/models/music/music-tag";

interface IState {
  singerList: IMusicSingerVO[];
  languageList: IMusicLanguageVO[];
  regionList: IMusicRegionVO[];
  tagList: IMusicTagVO[];
  styleList: IMusicStyleVO[];
}

const MusicSearch = defineComponent({
  name: "MusicSearch",
  props: {
    filters: {
      type: Object as PropType<ITableFilter<IQueryMusicDTO>>,
      default: () => ({}),
    },
  },
  emits: ["search", "reset"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const singerCtor = new MusicSingerController();
    const languageCtor = new MusicLanguageController();
    const regionCtor = new MusicRegionController();
    const styleCtor = new MusicStyleController();
    const tagCtor = new MusicTagController();

    const statusOpts = getEnumOptions(MUSIC_STATUS);
    const recommendOpts = getEnumOptions(YoN);
    const state = reactive<IState>({
      singerList: [],
      languageList: [],
      regionList: [],
      tagList: [],
      styleList: [],
    });

    loadData();

    async function loadData() {
      try {
        const [singerList, languageList, regionList, styleList, tagList] = await Promise.all([
          singerCtor.getSingerList({ page: 1, size: 1000000 }),
          languageCtor.getLanguageList({ page: 1, size: 1000000 }),
          regionCtor.getRegionList({ page: 1, size: 1000000 }),
          styleCtor.getStyleList({ page: 1, size: 1000000 }),
          tagCtor.getTagList({ page: 1, size: 1000000 }),
        ]);
        state.singerList = singerList.items.map(s => ({ label: s.name, value: `${s.id}`, ...s }));
        state.languageList = languageList.items.map(s => ({ label: s.name, value: `${s.id}`, ...s }));
        state.regionList = regionList.items.map(s => ({ label: s.name, value: `${s.id}`, ...s }));
        state.styleList = styleList.items.map(s => ({ label: s.name, value: `${s.id}`, ...s }));
        state.tagList = tagList.items.map(s => ({ label: s.name, value: `${s.id}`, ...s }));
      } catch (error) {
        console.log(error);
      }
    }

    function filterOption(input: string, option: any) {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    return () => (
      <Form class="table-form">
        <Space
          wrap
          class="py-3"
        >
          <Form.Item label="歌手">
            <Select
              v-model:value={props.filters.singer!.value}
              filterOption={filterOption}
              showSearch
              placeholder="请选择歌手"
              options={state.singerList}
              allowClear
              class="w-120"
            />
          </Form.Item>

          <Form.Item label="状态">
            <Select
              v-model:value={props.filters.status!.value}
              options={statusOpts}
              placeholder="状态"
              allowClear
              class="w-120"
            />
          </Form.Item>

          <Form.Item label="地区">
            <Select
              v-model:value={props.filters.region!.value}
              options={state.regionList}
              filterOption={filterOption}
              placeholder="请选择地区"
              allowClear
              class="w-120"
            />
          </Form.Item>

          <Form.Item label="语种">
            <Select
              v-model:value={props.filters.language!.value}
              options={state.languageList}
              filterOption={filterOption}
              placeholder="请选择语种"
              allowClear
              class="w-120"
            />
          </Form.Item>

          <Form.Item label="是否推荐">
            <Select
              v-model:value={props.filters.recommend!.value}
              options={recommendOpts}
              placeholder="请选择"
              allowClear
              class="w-120"
            />
          </Form.Item>
        </Space>

        <div>
          <Space
            wrap
            class="py-3"
          >
            <Form.Item label="标签">
              <Select
                mode="multiple"
                v-model:value={props.filters.tag!.value}
                options={state.tagList}
                maxTagCount={1}
                filterOption={filterOption}
                placeholder="请选择标签"
                allowClear
                class="w-170"
              />
            </Form.Item>

            <Form.Item label="风格">
              <Select
                mode="multiple"
                v-model:value={props.filters.style!.value}
                options={state.styleList}
                maxTagCount={1}
                filterOption={filterOption}
                placeholder="请选择风格"
                allowClear
                class="w-170"
              />
            </Form.Item>

            <Form.Item label="关键词">
              <Input
                allowClear
                v-model:value={props.filters.keywords!.value}
                class="w-200"
                placeholder={t("common.keywords")}
                onPressEnter={() => emit("search")}
              />
            </Form.Item>

            <Button
              type="link"
              size="small"
              onClick={() => emit("search")}
            >
              搜索
            </Button>
            <Button
              type="text"
              size="small"
              onClick={() => emit("reset")}
            >
              重置
            </Button>
          </Space>
        </div>
      </Form>
    );
  },
});

export default MusicSearch;
