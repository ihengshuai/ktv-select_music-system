import { Button, Drawer, Form, Input, message } from "ant-design-vue";
import { defineComponent, PropType, reactive, watchEffect } from "vue";

import { MusicRegionController } from "@/api/music/music-region";
import { useFormPage } from "@/hooks";
import { IMusicRegionVO, IUpdateMusicRegionDTO } from "@/typings/models/music/music-region";
import { createRegionModel, createRegionRules } from "@/views/music/helper";

const UpdateRegionDrawer = defineComponent({
  name: "UpdateRegionDrawer",
  props: {
    visible: Boolean,
    column: {
      type: Object as PropType<IMusicRegionVO | null>,
      default: null,
    },
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new MusicRegionController();

    const formModel = reactive(createRegionModel());
    const formRules = createRegionRules();

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

    async function onSubmit(payload: IUpdateMusicRegionDTO) {
      await controller.updateRegionStyle(props.column!.id, payload);

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
          title={`编辑地区【${props.column?.name}】`}
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

export default UpdateRegionDrawer;
