import { Button, Drawer, Form, Input, message } from "ant-design-vue";
import { defineComponent, PropType, reactive, watchEffect } from "vue";

import { MusicStyleController } from "@/api/music/music-style";
import { useFormPage } from "@/hooks";
import { IMusicStyleVO, IUpdateMusicStyleDTO } from "@/typings/models/music/music-style";
import { createSingerModel, createSingerRules } from "@/views/music/helper";

const UpdateStyleDrawer = defineComponent({
  name: "UpdateStyleDrawer",
  props: {
    visible: Boolean,
    column: {
      type: Object as PropType<IMusicStyleVO | null>,
      default: null,
    },
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new MusicStyleController();

    const formModel = reactive(createSingerModel());
    const formRules = createSingerRules();

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

    async function onSubmit(payload: IUpdateMusicStyleDTO) {
      await controller.updateMusicStyle(props.column!.id, payload);

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
          title={`编辑风格【${props.column?.name}】`}
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

export default UpdateStyleDrawer;
