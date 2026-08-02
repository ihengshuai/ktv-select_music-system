import { Alert, Button, Flex, Form, Input, InputPassword, Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";

import { AUTH_API, systemInitApi } from "@/api/auth";
import { useConfig } from "@/config";
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
      onSubmit: data => toSystemInit(data),
    });

    async function toSystemInit(data: IUserLoginOrSignUpDTO) {
      try {
        const res = await systemInitApi(data);

        if (res) {
          Modal.confirm({
            title: "温馨提示",
            content: "系统初始化成功,您现在可以通过设置的根用户登录了",
            onOk: () => {
              location.replace(decodeURIComponent((route.query.redirect as string) || "/"));
            },
          });
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
      <section class={`${ns.b()} system-init`}>
        <h1 class={ns.e("title")} />

        <div class={ns.e("content")}>
          <div class={ns.e("form")}>
            <h2>系统初始化</h2>
            <Form
              ref={formRef}
              {...formProps.value}
            >
              <Alert
                class="bg-orange text-white mb-24"
                message="请为系统创建root账号和密码,创建后可直接通过root账户登录系统；后续其它账号的注册均需管理员激活，请妥善保管root账号和密码"
              />

              <Form.Item name="username">
                <Input
                  size="large"
                  v-model:value={model.username.value}
                  placeholder={"root账号"}
                  onPressEnter={handleSubmitForm}
                />
              </Form.Item>

              <Form.Item name="password">
                <InputPassword
                  size="large"
                  v-model:value={model.password.value}
                  placeholder={"root密码"}
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
                  确定
                </Button>
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
