import { Button, Drawer, Form, Input } from "ant-design-vue";
import { defineComponent, reactive, watchEffect } from "vue";

import { MusicStyleController } from "@/api/music/music-style";
import { useFormPage } from "@/hooks";
import { ICreateMusicStyleDTO } from "@/typings/models/music/music-style";
import { createSingerModel, createSingerRules } from "@/views/music/helper";

const CreateStyleDrawer = defineComponent({
  name: "CreateStyleDrawer",
  props: {
    visible: Boolean,
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new MusicStyleController();

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

    async function onSubmit(payload: ICreateMusicStyleDTO) {
      await controller.createStyle(payload);
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
          title="新建风格"
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
              label="风格名称"
              name="name"
              required
            >
              <Input
                v-model:value={formModel.name.value}
                placeholder="请输入风格名称"
              />
            </Form.Item>
          </Form>
        </Drawer>
      );
    };
  },
});

export default CreateStyleDrawer;
