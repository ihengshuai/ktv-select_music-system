import { Button, Flex, Form, Input, InputPassword, message } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { AUTH_API, loginApi } from "@/api/auth";
import { useConfig } from "@/config";
import { ROUTE_NAME } from "@/constants/route";
import { useFormPage } from "@/hooks";
import LayoutFooter from "@/layout/default/footer";
import { IFormModel, IFormRules } from "@/typings/common/form";
import { IUserLoginOrSignUpDTO } from "@/typings/models/user";
import { getAsset, useNameSpace } from "@/util";

import "../style.less";
import { createUserAuthModel, createUserLoginOrSignFormRule } from "../helper";

const config = useConfig();

const ns = useNameSpace("auth-layout");
const captchaURL = config.API_DOMAIN + config.API_PREFIX + AUTH_API.captcha;

const LoginPage = defineComponent({
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
      onSubmit: data => toLogin(data),
    });

    async function toLogin(data: IUserLoginOrSignUpDTO) {
      try {
        const res = await loginApi(data);

        if (res) {
          message.success("登录成功");
          location.replace(decodeURIComponent((route.query.redirect as string) || "/"));
        } else {
          resetCaptchaURL();
        }
      } finally {
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
            <h2>Login In</h2>
            <Form
              ref={formRef}
              {...formProps.value}
            >
              <Form.Item name="username">
                <Input
                  size="large"
                  v-model:value={model.username.value}
                  placeholder={"账号"}
                  onPressEnter={handleSubmitForm}
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
                  登录
                </Button>
              </Form.Item>

              <Form.Item class="mt-24">
                <RouterLink
                  style="color: rgb(65 144 230)"
                  to={{ replace: true, name: ROUTE_NAME.register }}
                >
                  没账号?去注册
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

export default LoginPage;
