import { Button, Drawer, Form, Radio, RadioGroup, Textarea } from "ant-design-vue";
import { defineComponent, PropType, reactive, watchEffect } from "vue";

import { EnumCodeController } from "@/api/enum-code";
import { YoN } from "@/constants/common";
import { useFormPage } from "@/hooks";
import { IEnumCodeVO, IUpdateEnumCodeDTO } from "@/typings/models/enum-code/enum-code";

import { createUpdateEnumCodeFormModel, createUpdateEnumCodeRule } from "../helper";

const EnumCodeUpdateDrawer = defineComponent({
  name: "EnumCodeUpdateDrawer",
  props: {
    visible: Boolean,
    column: {
      type: Object as PropType<IEnumCodeVO | null>,
      default: null,
    },
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new EnumCodeController();

    const formModel = reactive(createUpdateEnumCodeFormModel());
    const formRules = createUpdateEnumCodeRule();

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

    async function onSubmit(payload: IUpdateEnumCodeDTO) {
      await controller.updateEnumCode(props.column!.code, payload);
      emit("success");
    }

    return () => (
      <Drawer
        width={500}
        title={`编辑枚举值【${props.column?.code}】`}
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
          >
            <span>{props.column?.code}</span>
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

export default EnumCodeUpdateDrawer;
