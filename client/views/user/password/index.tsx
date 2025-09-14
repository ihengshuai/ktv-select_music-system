import { Button, Col, Form, FormItem, InputPassword, message, Row, Space, Spin } from "ant-design-vue";
// @ts-ignore
import md5 from "md5";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

import { UserController } from "@/api/user";
import IPanel from "@/components/common/panel";
import { ROUTE_NAME } from "@/constants/route";
import { useFormPage } from "@/hooks";
import { IFormModel, IFormRules } from "@/typings/common/form";
import { IChangePassword } from "@/typings/models/user";
import { sleep } from "@/util";

interface IChangePasswordForm extends IChangePassword {
  confirmPassword: string;
}

const PWD_MIN_LENGTH = 6;

const UserPasswordPage = defineComponent({
  name: "UserPasswordPage",
  setup() {
    const userController = new UserController();
    const router = useRouter();

    const formModel = reactive<IFormModel<IChangePasswordForm>>({
      oldPassword: {
        value: null,
        transform: v => v && md5(v),
      },
      newPassword: {
        value: null,
        transform: v => v && md5(v),
      },
      confirmPassword: {
        value: null,
        transform: v => v && md5(v),
      },
    });

    const formRules: IFormRules<IChangePasswordForm> = {
      oldPassword: {
        required: true,
        trigger: "blur",
        validator: (rule, { value }) => {
          if (!value) {
            return Promise.reject("请输入旧密码");
          } else {
            return Promise.resolve();
          }
        },
      },
      newPassword: {
        required: true,
        trigger: "blur",
        validator: (rule, { value }) => {
          if (!value) {
            return Promise.reject("请输入新密码");
          } else if (value.length < PWD_MIN_LENGTH) {
            return Promise.reject(`密码长度不能小于${PWD_MIN_LENGTH}位`);
          } else {
            return Promise.resolve();
          }
        },
      },
      confirmPassword: {
        required: true,
        trigger: "blur",
        validator: (rule, { value }) => {
          if (!value) {
            return Promise.reject("请输入确认密码");
          } else if (value !== formModel.newPassword.value) {
            return Promise.reject("两次密码不一致");
          } else {
            return Promise.resolve();
          }
        },
      },
    };

    const { formRef, formProps, formLoading, handleSubmitForm } = useFormPage<IChangePasswordForm>({
      formModel,
      formRules,
      baseProps: {
        labelCol: { span: 3 },
        wrapperCol: { span: 16 },
      },
      initFormData: async x => x!,
      onSubmit: submitForm,
    });

    async function submitForm(data: IChangePasswordForm) {
      if (data.oldPassword === data.newPassword) {
        message.warn("新密码不能与旧密码相同");
        return;
      }

      const payload: IChangePassword = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };

      const res = await userController.changeUserPassword(payload);

      if (res) {
        message.success("修改成功! 请重新登录!");

        await sleep(800);

        location.replace(router.resolve({ name: ROUTE_NAME.login }).fullPath);
      }
    }

    return () => (
      <IPanel>
        <Spin spinning={formLoading.value}>
          <Row>
            <Col span={12}>
              <Form
                ref={formRef}
                {...formProps.value}
              >
                <FormItem
                  label="旧密码"
                  name="oldPassword"
                >
                  <InputPassword
                    v-model:value={formModel.oldPassword.value}
                    placeholder="请输入旧密码"
                  />
                </FormItem>

                <FormItem
                  label="新密码"
                  name="newPassword"
                >
                  <InputPassword
                    v-model:value={formModel.newPassword.value}
                    placeholder="请输入新密码"
                  />
                </FormItem>

                <FormItem
                  label="确认密码"
                  name="confirmPassword"
                >
                  <InputPassword
                    v-model:value={formModel.confirmPassword.value}
                    placeholder="请输入确认密码"
                  />
                </FormItem>

                <FormItem label=" ">
                  <Space>
                    <Button onClick={() => router.back()}>返回</Button>
                    <Button
                      type="primary"
                      onClick={handleSubmitForm}
                    >
                      提交
                    </Button>
                  </Space>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Spin>
      </IPanel>
    );
  },
});

export default UserPasswordPage;
