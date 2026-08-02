import { Button, Drawer, Form, Input } from "ant-design-vue";
import { defineComponent, reactive, watchEffect } from "vue";

import { MusicLanguageController } from "@/api/music/music-language";
import { useFormPage } from "@/hooks";
import { ICreateMusicLanguageDTO } from "@/typings/models/music/music-language";
import { createLanguageModel, createLanguageRules } from "@/views/music/helper";

const CreateLanguageDrawer = defineComponent({
  name: "CreateLanguageDrawer",
  props: {
    visible: Boolean,
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new MusicLanguageController();

    const formModel = reactive(createLanguageModel());
    const formRules = createLanguageRules();

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

    async function onSubmit(payload: ICreateMusicLanguageDTO) {
      await controller.createMusicLanguage(payload);
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
          title="新建语种"
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
              label="地区语种"
              name="name"
              required
            >
              <Input
                v-model:value={formModel.name.value}
                placeholder="请输入地区语种"
              />
            </Form.Item>
          </Form>
        </Drawer>
      );
    };
  },
});

export default CreateLanguageDrawer;
