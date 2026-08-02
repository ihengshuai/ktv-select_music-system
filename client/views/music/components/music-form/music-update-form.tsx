import { Col, Form, message, Row, Spin } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { MusicController } from "@/api/music/music";
import { ROUTE_NAME } from "@/constants/route";
import { useFormPage } from "@/hooks";
import { IMusicCreateDTO, IMusicVO } from "@/typings/models/music/music";

import MusicBaseForm from "./music-base-form";
import { createMusicModel, createMusicRules } from "../../helper";

export interface IMusicUpdateFormExpose {
  handleSubmitForm: () => void;
}

const MusicUpdateForm = defineComponent({
  name: "MusicUpdateForm",
  setup(props, { expose }) {
    const route = useRoute();
    const router = useRouter();
    const musicCtor = new MusicController();

    const formModel = reactive(createMusicModel());
    const formRules = createMusicRules();

    const state = reactive<{ musicDetail: IMusicVO | null }>({
      musicDetail: null,
    });

    const { formRef, formLoading, formProps, initFormModel, handleSubmitForm } = useFormPage<IMusicCreateDTO>({
      formModel,
      formRules,
      baseProps: {
        colon: true,
      },
      // @ts-ignore
      initFormData: loadMusicDetail,
      onSubmit: data => onSubmit(data!),
    });

    async function onSubmit(data: IMusicCreateDTO) {
      try {
        const payload: IMusicCreateDTO = {
          ...data,
          tag: (data.tag as unknown as string[])?.join(","),
          style: (data.style as unknown as string[])?.join(","),
        };
        await musicCtor.updateMusic(route.params.songId as unknown as string, payload);
        message.success("更新成功!");
        router.replace({ name: ROUTE_NAME.musicList });
      } catch (error) {
        message.error("更新失败");
      }
    }

    async function loadMusicDetail() {
      const res = await musicCtor.getMusicDetail(route.params.songId as unknown as string);

      state.musicDetail = res;
      // @ts-ignore
      initFormModel(res, {
        tag: () => (res.tag && res.tag?.map(l => l.id)) || [],
        style: () => (res.style && res.style?.map(l => l.id)) || [],
        singer: () => Number(res.singer),
        language: () => Number(res.language),
        region: () => Number(res.region),
      });
    }

    expose<IMusicUpdateFormExpose>({
      handleSubmitForm,
    });

    return () => (
      <Spin spinning={formLoading.value}>
        <Form
          ref={formRef}
          class="form"
          {...formProps.value}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Row>
            <Col span="12">
              <Form.Item label="歌曲ID">
                <span class="text-gray underline"> {state.musicDetail?.uid}</span>
              </Form.Item>
            </Col>
          </Row>

          <MusicBaseForm formModel={formModel} />

          <Row>
            <Col span="12">
              <Form.Item label="创建者">
                <span class="text-gray underline">{state.musicDetail?.createBy}</span>
              </Form.Item>
            </Col>

            <Col span="12">
              <Form.Item label="创建时间">
                <span class="text-gray underline">{state.musicDetail?.createTime}</span>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  },
});

export default MusicUpdateForm;
