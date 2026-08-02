import { Button, Drawer, Form, Input } from "ant-design-vue";
import { defineComponent, reactive, watchEffect } from "vue";

import { MusicRegionController } from "@/api/music/music-region";
import { useFormPage } from "@/hooks";
import { ICreateMusicRegionDTO } from "@/typings/models/music/music-region";
import { createRegionModel, createRegionRules } from "@/views/music/helper";

const CreateRegionDrawer = defineComponent({
  name: "CreateRegionDrawer",
  props: {
    visible: Boolean,
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new MusicRegionController();

    const formModel = reactive(createRegionModel());
    const formRules = createRegionRules();

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

    async function onSubmit(payload: ICreateMusicRegionDTO) {
      await controller.createRegion(payload);
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
          title="新建地区"
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
              label="地区名称"
              name="name"
              required
            >
              <Input
                v-model:value={formModel.name.value}
                placeholder="请输入地区名称"
              />
            </Form.Item>
          </Form>
        </Drawer>
      );
    };
  },
});

export default CreateRegionDrawer;
