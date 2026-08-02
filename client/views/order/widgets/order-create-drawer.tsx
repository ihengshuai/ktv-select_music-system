import { Button, Drawer, Form, InputNumber, InputPassword, message, Modal } from "ant-design-vue";
import md5 from "md5";
import { computed, defineComponent, PropType, reactive, watchEffect } from "vue";

import { EnumCodeController } from "@/api/enum-code";
import { OrderController } from "@/api/order/order";
import { YoN } from "@/constants/common";
import { ENUM_CODE } from "@/constants/enum-code";
import { BusinessValidationException } from "@/helper/exception";
import { useFormPage } from "@/hooks";
import { IOrderVO } from "@/typings/models/order/order";

import { createOrderFormRules, createOrderModel } from "../helper";

const OrderCreateDrawer = defineComponent({
  name: "OrderCreateDrawer",
  props: {
    visible: Boolean,
    orderDetail: {
      type: Object as PropType<IOrderVO>,
      default: null,
    },
  },
  emits: ["success", "close"],
  setup(props, { emit }) {
    const controller = new OrderController();
    const enumController = new EnumCodeController();

    const state = reactive({
      modalVisible: false,
      formLoading: false,
      price: 0,
    });

    const title = computed(() => (props.orderDetail ? "续费" : "下单"));

    const formModel = reactive(createOrderModel());
    const formRules = createOrderFormRules();

    const { formRef, formProps, getFormValues, clearModel, handleSubmitForm } = useFormPage({
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

    const currentOnlinePriceTotal = computed(() => {
      const hours = formModel.longTime.value || 0;
      const price = state.price || 0;
      const total = hours * price || "-";

      return `当前上机单价<span style="color: red">「${price}元/小时」</span><br>
      上机时长<span style="color: red">「${hours}小时」</span><br>
      预计总价<span style="margin-top:10px;font-size:16px;font-weight:bold;color: red">「${total}元」</span>`;
    });

    watchEffect(() => {
      if (!props.visible) {
        clearModel();
      } else {
        loadOrderUnitPrice();
      }
    });

    async function onSubmit() {
      state.modalVisible = true;
    }

    async function onModalSubmit() {
      if (!formModel.operatorPassword.value) {
        message.error("请输入管理员密码");
        throw new BusinessValidationException("请输入管理员密码");
      }

      state.formLoading = true;

      try {
        const payload = getFormValues();
        payload.operatorPassword = md5(payload.operatorPassword);

        if (props.orderDetail) {
          await controller.renew({
            ...payload,
            orderNo: props.orderDetail.orderNo,
          });
          message.success("续费成功");
        } else {
          await controller.createOrder(payload);
          message.success("下单成功");
        }

        onModalCancel();
        emit("success");
      } finally {
        state.formLoading = false;
      }
    }

    async function onModalCancel() {
      state.modalVisible = false;
      formModel.operatorPassword.value = null;
    }

    async function loadOrderUnitPrice() {
      const res = await enumController.getEnumCodeDetail({ code: ENUM_CODE.ONLINE_PER_HOUR_PRICE, status: YoN.Y });

      if (res?.status === YoN.Y) {
        state.price = Number(res.value);
      } else {
        message.error("获取单价失败，请在系统配置");
      }
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
            loading={state.formLoading}
            onClick={handleSubmitForm}
          >
            提交
          </Button>
        </>
      );

      return (
        <>
          <Drawer
            width={500}
            title={title.value}
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
                label="时长"
                name="longTime"
                required
              >
                <InputNumber
                  v-model:value={formModel.longTime.value}
                  placeholder="上机时长"
                  min={0.5}
                  step={0.5}
                  class="w-full"
                />

                <div
                  class="font-size-12px mt-12 color-coolGray"
                  v-html={currentOnlinePriceTotal.value}
                />
              </Form.Item>
            </Form>
          </Drawer>

          <Modal
            title="密码"
            open={state.modalVisible}
            closable={false}
            maskClosable={false}
            confirmLoading={state.formLoading}
            destroyOnClose
            onCancel={onModalCancel}
            onOk={onModalSubmit}
          >
            <InputPassword
              v-model:value={formModel.operatorPassword.value}
              placeholder="请输入管理员密码"
            />
          </Modal>
        </>
      );
    };
  },
});

export default OrderCreateDrawer;
