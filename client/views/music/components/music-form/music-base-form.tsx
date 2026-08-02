import { UploadOutlined } from "@ant-design/icons-vue";
import { Button, Col, Form, Input, InputNumber, Row, Select, Upload } from "ant-design-vue";
import { defineComponent, PropType, reactive, watchEffect } from "vue";

import { MusicLanguageController } from "@/api/music/music-language";
import { MusicRegionController } from "@/api/music/music-region";
import { MusicSingerController } from "@/api/music/music-singer";
import { MusicStyleController } from "@/api/music/music-style";
import { MusicTagController } from "@/api/music/music-tag";
import { getFileInfoAPI, uploadResourceAPI } from "@/api/static/static.api";
import { YoN } from "@/constants/common";
import { FILE_LOCATION, FILE_TYPE } from "@/constants/file";
import { MUSIC_STATUS } from "@/constants/music";
import { getEnumOptions } from "@/helper";
import { IFormModel } from "@/typings/common/form";
import { IMusicCreateDTO } from "@/typings/models/music/music";
import { IMusicLanguageVO } from "@/typings/models/music/music-language";
import { IMusicRegionVO } from "@/typings/models/music/music-region";
import { IMusicSingerVO } from "@/typings/models/music/music-singer";
import { IMusicStyleVO } from "@/typings/models/music/music-style";
import { IMusicTagVO } from "@/typings/models/music/music-tag";
import { IStaticDTO, IStaticVO } from "@/typings/models/static/static";

import MusicPreview from "../../components/music-preview";

interface IListState {
  singerList: IMusicSingerVO[];
  languageList: IMusicLanguageVO[];
  regionList: IMusicRegionVO[];
  tagList: IMusicTagVO[];
  styleList: IMusicStyleVO[];
}
interface IState {
  musicFileUploading: boolean;
  musicFile: IStaticVO | null;
}

const MusicBaseForm = defineComponent({
  name: "MusicBaseForm",
  props: {
    formModel: {
      type: Object as PropType<IFormModel<IMusicCreateDTO>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const singerCtor = new MusicSingerController();
    const languageCtor = new MusicLanguageController();
    const regionCtor = new MusicRegionController();
    const styleCtor = new MusicStyleController();
    const tagCtor = new MusicTagController();

    const statusOpts = getEnumOptions(MUSIC_STATUS);
    const recommendOpts = getEnumOptions(YoN);
    const listState = reactive<IListState>({
      singerList: [],
      languageList: [],
      regionList: [],
      tagList: [],
      styleList: [],
    });

    const state = reactive<IState>({
      musicFileUploading: false,
      musicFile: null,
    });

    loadData();

    watchEffect(() => {
      const audioFileId = Number(props.formModel.audio.value || -1);
      if (audioFileId > 0) {
        getFileInfoAPI(audioFileId).then(res => {
          state.musicFile = res;
        });
      }
    });

    async function loadData() {
      try {
        const [singerList, languageList, regionList, styleList, tagList] = await Promise.all([
          singerCtor.getSingerList({ page: 1, size: 1000000 }),
          languageCtor.getLanguageList({ page: 1, size: 1000000 }),
          regionCtor.getRegionList({ page: 1, size: 1000000 }),
          styleCtor.getStyleList({ page: 1, size: 1000000 }),
          tagCtor.getTagList({ page: 1, size: 1000000 }),
        ]);
        listState.singerList = singerList.items.map(s => ({ label: s.name, value: s.id, ...s }));
        listState.languageList = languageList.items.map(s => ({ label: s.name, value: s.id, ...s }));
        listState.regionList = regionList.items.map(s => ({ label: s.name, value: s.id, ...s }));
        listState.styleList = styleList.items.map(s => ({ label: s.name, value: s.id, ...s }));
        listState.tagList = tagList.items.map(s => ({ label: s.name, value: s.id, ...s }));
      } catch (error) {
        console.log(error);
      }
    }

    async function beforeUploadMusicFile(e: any) {
      if (!e.file) return;

      try {
        state.musicFileUploading = true;
        const payload: IStaticDTO = {
          file: e.file,
          location: FILE_LOCATION.LOCAL,
          type: FILE_TYPE.AUDIO,
          remark: "上传音乐",
        };

        const res = await uploadResourceAPI(payload);

        props.formModel.audio!.value = res.id as unknown as string;
        state.musicFile = res;
      } catch (error) {
        // ...
      } finally {
        state.musicFileUploading = false;
      }
    }
    function onRemoveMusic() {
      props.formModel.audio!.value = null;
    }

    function filterOption(input: string, option: any) {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    return () => (
      <Row>
        <Col span="12">
          <Form.Item
            name="title"
            label="标题"
          >
            <Input v-model:value={props.formModel.title.value} />
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="audio"
            label="歌曲文件"
          >
            {props.formModel.audio.value && state.musicFile ? (
              <MusicPreview
                showRemove
                fileName={state.musicFile!.fileName}
                url={state.musicFile!.url}
                onRemove={onRemoveMusic}
              />
            ) : (
              <Upload
                accept="audio/*"
                showUploadList={false}
                customRequest={beforeUploadMusicFile}
              >
                <Button
                  loading={state.musicFileUploading}
                  disabled={state.musicFileUploading}
                >
                  <UploadOutlined />
                  选择歌曲
                </Button>
              </Upload>
            )}
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="lyrics"
            label="歌词文件"
          >
            <Upload>
              <Button>
                <UploadOutlined />
                选择歌词
              </Button>
            </Upload>
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="video"
            label="MV文件"
          >
            <Upload>
              <Button>
                <UploadOutlined />
                选择MV
              </Button>
            </Upload>
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="singer"
            label="歌手"
          >
            <Select
              v-model:value={props.formModel.singer.value}
              options={listState.singerList}
              placeholder="请选择歌手"
              filter-option={filterOption}
              show-search
            />
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="language"
            label="语种"
          >
            <Select
              v-model:value={props.formModel.language.value}
              options={listState.languageList}
              placeholder="请选择语种"
            />
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="region"
            label="地区"
          >
            <Select
              v-model:value={props.formModel.region.value}
              options={listState.regionList}
              placeholder="请选择地区"
            />
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="style"
            label="风格"
          >
            <Select
              v-model:value={props.formModel.style!.value}
              options={listState.styleList}
              mode="multiple"
              placeholder="请选择风格"
            />
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="tag"
            label="标签"
          >
            <Select
              v-model:value={props.formModel.tag!.value}
              mode="multiple"
              options={listState.tagList}
              placeholder="请选择标签"
            />
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="status"
            label="状态"
          >
            <Select
              v-model:value={props.formModel.status!.value}
              options={statusOpts}
              placeholder="请选择状态"
            />
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="heat"
            label="热度"
          >
            <InputNumber
              v-model:value={props.formModel.heat!.value}
              min={0}
              class="w-220px"
              placeholder="请输入歌曲热度"
            />
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="recommend"
            label="是否推荐"
          >
            <Select
              v-model:value={props.formModel.recommend!.value}
              options={recommendOpts}
              class="w-220px"
            />
          </Form.Item>
        </Col>

        <Col span="12">
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea
              v-model:value={props.formModel.remark!.value}
              rows={3}
              placeholder="请输入歌曲备注"
            />
          </Form.Item>
        </Col>
      </Row>
    );
  },
});

export default MusicBaseForm;
