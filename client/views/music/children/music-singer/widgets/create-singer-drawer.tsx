import { Button, Drawer, Form, Input } from "ant-design-vue";
import { defineComponent, reactive, watchEffect } from "vue";

import { MusicSingerController } from "@/api/music/music-singer";
import { useFormPage } from "@/hooks";
import { ICreateMusicSingerDTO } from "@/typings/models/music/music-singer";
import { createSingerModel, createSingerRules } from "@/views/music/helper";

const CreateSingerDrawer = defineComponent({
  name: "CreateSingerDrawer",
  props: {
    visible: Boolean,
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new MusicSingerController();

    const formModel = reactive(createSingerModel());
    const formRules = createSingerRules();

    const { formRef, formLoading, formProps, clearModel, handleSubmitForm } = useFormPage({
      formModel,
      formRules,
      baseProps: {
        colon: true,
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      initFormData: async x => x!,
      onSubmit: onSubmit,
    });

    watchEffect(() => {
      if (!props.visible) {
        clearModel();
      }
    });

    async function onSubmit(payload: ICreateMusicSingerDTO) {
      await controller.createSinger(payload);
      emit("success");
    }

    return () => {
      const DrawerFooter = () => (
        <>
          <Button
            style="margin-right: 8px"
            onClick={() => emit("close")}
          >
            取消
          </Button>
          <Button
            type="primary"
            loading={formLoading.value}
            onClick={handleSubmitForm}
          >
            提交
          </Button>
        </>
      );

      return (
        <Drawer
          width={500}
          title="新建歌手"
          open={props.visible}
          closable={false}
          maskClosable={false}
          onClose={() => emit("close")}
          footer-style={{ textAlign: "right" }}
          destroyOnClose
          v-slots={{
            footer: DrawerFooter,
          }}
        >
          <Form
            ref={formRef}
            model={formModel}
            {...formProps.value}
          >
            <Form.Item
              label="歌手名称"
              name="name"
              required
            >
              <Input
                v-model:value={formModel.name.value}
                placeholder="请输入歌手名称"
              />
            </Form.Item>
          </Form>
        </Drawer>
      );
    };
  },
});

export default CreateSingerDrawer;
