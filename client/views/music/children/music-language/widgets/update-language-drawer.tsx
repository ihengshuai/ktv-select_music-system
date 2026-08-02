import { Button, Drawer, Form, Input, message } from "ant-design-vue";
import { defineComponent, PropType, reactive, watchEffect } from "vue";

import { MusicLanguageController } from "@/api/music/music-language";
import { useFormPage } from "@/hooks";
import { IMusicLanguageVO, IUpdateMusicLanguageDTO } from "@/typings/models/music/music-language";
import { createLanguageModel, createLanguageRules } from "@/views/music/helper";

const UpdateLanguageDrawer = defineComponent({
  name: "UpdateLanguageDrawer",
  props: {
    visible: Boolean,
    column: {
      type: Object as PropType<IMusicLanguageVO | null>,
      default: null,
    },
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new MusicLanguageController();

    const formModel = reactive(createLanguageModel());
    const formRules = createLanguageRules();

    const { formRef, formLoading, formProps, initFormModel, clearModel, handleSubmitForm } = useFormPage({
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
      } else {
        initFormModel(props.column!);
      }
    });

    async function onSubmit(payload: IUpdateMusicLanguageDTO) {
      await controller.updateMusicLanguage(props.column!.id, payload);

      message.success("更新成功");
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
          title={`编辑语种【${props.column?.name}】`}
          open={props.visible}
          closable={false}
          maskClosable={false}
          onClose={() => emit("close")}
          footer-style={{ textAlign: "right" }}
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
              label="语种名称"
              name="name"
              required
            >
              <Input
                v-model:value={formModel.name.value}
                placeholder="请输入语种名称"
              />
            </Form.Item>
          </Form>
        </Drawer>
      );
    };
  },
});

export default UpdateLanguageDrawer;
