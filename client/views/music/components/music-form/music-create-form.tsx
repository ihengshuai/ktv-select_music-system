import { Form, message, Spin } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

import { MusicController } from "@/api/music/music";
import { ROUTE_NAME } from "@/constants/route";
import { useFormPage } from "@/hooks";
import { IMusicCreateDTO } from "@/typings/models/music/music";

import MusicBaseForm from "./music-base-form";
import { createMusicModel, createMusicRules } from "../../helper";

export interface IMusicCreateFormExpose {
  handleSubmitForm: () => void;
}

const MusicCreateForm = defineComponent({
  name: "MusicCreateForm",
  setup(props, { expose }) {
    const router = useRouter();
    const musicCtor = new MusicController();

    const formModel = reactive(createMusicModel());
    const formRules = createMusicRules();

    const { formRef, formLoading, formProps, handleSubmitForm } = useFormPage({
      formModel,
      formRules,
      initFormData: async x => x!,
      onSubmit: data => onSubmit(data!),
    });

    async function onSubmit(data: IMusicCreateDTO) {
      try {
        const payload: IMusicCreateDTO = {
          ...data,
          tag: (data.tag as unknown as string[])?.join(","),
          style: (data.style as unknown as string[])?.join(","),
        };
        await musicCtor.createMusic(payload);
        message.success("添加成功!");
        router.replace({ name: ROUTE_NAME.musicList });
      } catch (error) {
        message.error("添加失败");
      }
    }

    expose<IMusicCreateFormExpose>({
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
          <MusicBaseForm formModel={formModel} />
        </Form>
      </Spin>
    );
  },
});

export default MusicCreateForm;
