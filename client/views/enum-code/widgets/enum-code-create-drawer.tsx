import { Button, Drawer, Form, Input, Radio, RadioGroup, Textarea } from "ant-design-vue";
import { defineComponent, reactive, watchEffect } from "vue";

import { EnumCodeController } from "@/api/enum-code";
import { YoN } from "@/constants/common";
import { useFormPage } from "@/hooks";
import { ICreateEnumCodeDTO } from "@/typings/models/enum-code/enum-code";

import { createEnumCodeFormModel, createEnumCodeRule } from "../helper";

const EnumCodeCreateDrawer = defineComponent({
  name: "EnumCodeCreateDrawer",
  props: {
    visible: Boolean,
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new EnumCodeController();

    const formModel = reactive(createEnumCodeFormModel());
    const formRules = createEnumCodeRule();

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

    async function onSubmit(payload: ICreateEnumCodeDTO) {
      await controller.createEnumCode(payload);
      emit("success");
    }

    return () => (
      <Drawer
        width={500}
        title="新建枚举编码"
        open={props.visible}
        closable={false}
        maskClosable={false}
        onClose={() => emit("close")}
        footer-style={{ textAlign: "right" }}
        v-slots={{
          footer: () => (
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
          ),
        }}
      >
        <Form
          ref={formRef}
          model={formModel}
          {...formProps.value}
        >
          <Form.Item
            label="枚举键"
            name="code"
            required
          >
            <Input
              v-model:value={formModel.code.value}
              placeholder="请输入枚举键"
            />
          </Form.Item>

          <Form.Item
            label="枚举值"
            name="value"
            required
          >
            <Textarea
              v-model:value={formModel.value.value}
              rows={3}
              placeholder="请输入枚举值"
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            required
          >
            <RadioGroup
              v-model:value={formModel.status.value}
              name="status"
            >
              <Radio value={YoN.Y}>启用</Radio>
              <Radio value={YoN.N}>禁用</Radio>
            </RadioGroup>
          </Form.Item>

          <Form.Item
            label="备注"
            name="remark"
          >
            <Textarea
              v-model:value={formModel.remark.value}
              rows={3}
              placeholder="请输入备注"
            />
          </Form.Item>
        </Form>
      </Drawer>
    );
  },
});

export default EnumCodeCreateDrawer;
