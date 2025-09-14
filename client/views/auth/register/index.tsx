import { Button, Flex, Form, Input, InputPassword, message, Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import { RouterLink, useRoute } from "vue-router";
import "../style.less";

import { AUTH_API, registerApi } from "@/api/auth";
import { useConfig } from "@/config";
import { ROUTE_NAME } from "@/constants/route";
import { useFormPage } from "@/hooks";
import LayoutFooter from "@/layout/default/footer";
import { IFormModel, IFormRules } from "@/typings/common/form";
import { IUserLoginOrSignUpDTO } from "@/typings/models/user";
import { getAsset, useNameSpace } from "@/util";

import { createUserAuthModel, createUserLoginOrSignFormRule } from "../helper";

const config = useConfig();
const captchaURL = config.API_DOMAIN + config.API_PREFIX + AUTH_API.captcha;

const ns = useNameSpace("auth-layout");

const RegisterPage = defineComponent({
  setup() {
    const route = useRoute();

    const captchaState = reactive({
      url: captchaURL,
    });

    const model = reactive<IFormModel<IUserLoginOrSignUpDTO>>(createUserAuthModel());
    const rules: IFormRules<IUserLoginOrSignUpDTO> = createUserLoginOrSignFormRule();

    const { formRef, formLoading, formProps, handleSubmitForm } = useFormPage<IUserLoginOrSignUpDTO>({
      formModel: model,
      formRules: rules,
      baseProps: {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
      },
      initFormData: async x => x!,
      onSubmit: data => toRegister(data),
    });

    async function toRegister(data: IUserLoginOrSignUpDTO) {
      try {
        const res = await registerApi(data);
        if (res) {
          message.success("注册成功");
          Modal.confirm({
            title: "温馨提示",
            content: "您的账号已注册成功,请联系管理员激活!",
            onOk: () => {
              location.replace((route.query.redirect as string) || "/");
            },
          });
        }
      } catch (error) {
        resetCaptchaURL();
      }
    }

    function resetCaptchaURL() {
      model.code.value = null;
      captchaState.url = captchaURL + "?t=" + new Date().getTime();
    }

    return () => (
      <section class={ns.b()}>
        <h1 class={ns.e("title")}>{config.APP_TITLE}</h1>

        <div class={ns.e("content")}>
          <div class={ns.e("form")}>
            <h2>Sign Up</h2>
            <Form
              ref={formRef}
              {...formProps.value}
            >
              <Form.Item name="username">
                <Input
                  size="large"
                  v-model:value={model.username.value}
                  placeholder={"账号"}
                />
              </Form.Item>

              <Form.Item name="password">
                <InputPassword
                  size="large"
                  v-model:value={model.password.value}
                  placeholder={"密码"}
                  onPressEnter={handleSubmitForm}
                />
              </Form.Item>

              <Form.Item name="code">
                <Flex
                  align="center"
                  justify="space-between"
                >
                  <Input
                    v-model:value={model.code.value}
                    size="large"
                    placeholder={"验证码"}
                    onPressEnter={handleSubmitForm}
                  />
                  <img
                    style="height:38px;border-radius: 4px;"
                    class="ml-8"
                    src={captchaState.url}
                    onClick={resetCaptchaURL}
                  />
                </Flex>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleSubmitForm}
                  loading={formLoading.value}
                  size="large"
                  block
                >
                  注册
                </Button>
              </Form.Item>

              <Form.Item class="mt-24">
                <RouterLink
                  style="color: rgb(65 144 230)"
                  to={{ replace: true, name: ROUTE_NAME.login }}
                >
                  有账号,去登录
                </RouterLink>
              </Form.Item>
            </Form>
          </div>

          <div class={ns.e("bg")}>
            <img src={getAsset("img/login-bg.png")} />
          </div>
        </div>

        <div class={ns.e("footer")}>
          <LayoutFooter />
        </div>
      </section>
    );
  },
});

export default RegisterPage;
