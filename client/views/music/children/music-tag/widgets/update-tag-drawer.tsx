import { Button, Drawer, Form, Input, message } from "ant-design-vue";
import { defineComponent, PropType, reactive, watchEffect } from "vue";

import { MusicTagController } from "@/api/music/music-tag";
import { useFormPage } from "@/hooks";
import { IMusicTagVO, IUpdateMusicTagDTO } from "@/typings/models/music/music-tag";
import { createTagModel, createTagRules } from "@/views/music/helper";

const UpdateTagDrawer = defineComponent({
  name: "UpdateTagDrawer",
  props: {
    visible: Boolean,
    column: {
      type: Object as PropType<IMusicTagVO | null>,
      default: null,
    },
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new MusicTagController();

    const formModel = reactive(createTagModel());
    const formRules = createTagRules();

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

    async function onSubmit(payload: IUpdateMusicTagDTO) {
      await controller.updateMusicTag(props.column!.id, payload);

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
          title={`编辑标签【${props.column?.name}】`}
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
              label="标签名称"
              name="name"
              required
            >
              <Input
                v-model:value={formModel.name.value}
                placeholder="请输入标签名称"
              />
            </Form.Item>
          </Form>
        </Drawer>
      );
    };
  },
});

export default UpdateTagDrawer;
