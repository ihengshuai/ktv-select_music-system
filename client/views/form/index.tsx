import {
  Button,
  CheckboxGroup,
  Flex,
  Form,
  FormItem,
  Input,
  RadioGroup,
  Select,
  Space,
  Spin,
  message,
} from "ant-design-vue";
import { defineComponent, reactive, ref } from "vue";

import { fetchUpdateUser, fetchUserDetail } from "@/api/mock";
import IPanel from "@/components/common/panel";
import { useFormPage } from "@/hooks";
import { IFormModel, IFormRules } from "@/typings/common/form";
import { IUser, IUserResponse } from "@/typings/models/user";
// import { TypeConverter } from "@/typings/common/type";

const roles = [
  { label: "老板", value: "boss" },
  { label: "员工", value: "worker" },
];
const hobbies = ["篮球🏀", "乒乓球🏓", "羽毛球🏸"];
const sex = [
  { label: "男性", value: "male" },
  { label: "女性", value: "female" },
];
const cities = [
  { label: "北京", value: "beijing" },
  { label: "上海", value: "shanghai" },
  { label: "广州", value: "guangzhou" },
  { label: "深圳", value: "shenzhen" },
  { label: "杭州", value: "hangzhou" },
  { label: "成都", value: "chengdu" },
  { label: "重庆", value: "chongqing" },
];

const FormPage = defineComponent({
  name: "FormPage",
  setup() {
    const keyOfModel = ref();
    const formRole = ref(roles[0].value);

    const formModel = reactive<IFormModel<IUser>>({
      name: {
        value: "test",
        transform: val => val?.toUpperCase(),
      },
      age: {
        value: null,
        type: Number,
        transform: val => Number(val),
      },
      sex: {
        value: null,
      },
      city: {
        value: [],
        field: "address.city",
      },
      hobbies: {
        value: null,
      },
      income: {
        value: null,
        type: Number,
        isShow: () => formRole.value !== "boss",
      },
    });
    const formRules: IFormRules<IUser> = {
      age: {
        async validator(rule, value) {
          if (!value || isNaN(parseInt(value.value as unknown as string))) return Promise.reject("年龄不能为空");
          return Promise.resolve();
        },
        trigger: "blur",
      },
    };
    const {
      formRef,
      formProps,
      formLoading,
      loadFormData,
      initFormModel,
      handleSubmitForm,
      getFormValueByField,
      clearModel,
    } = useFormPage<IUser, IUserResponse>({
      formModel,
      formRules,
      baseProps: {
        scrollToFirstError: true,
        colon: true,
      },
      initFormData(payload) {
        return fetchUserDetail(payload?.name || "test");
      },
      onSubmit: payload => fetchUpdateUser(payload.name, payload),
      // 表单数据变化后执行(可选回调)
      onDataChange(res) {
        // 内部默认会执行 initFormModel
        initFormModel(res);
      },
    });

    return () => (
      <IPanel withCard>
        <Button
          type="primary"
          danger
          onClick={handleSubmitForm}
          style={"margin-bottom:24px"}
        >
          测试重复提交
        </Button>
        <Spin spinning={formLoading.value}>
          <Form
            ref={formRef}
            {...formProps.value}
          >
            <RadioGroup
              v-model:value={formRole.value}
              options={roles}
              optionType="button"
              buttonStyle="solid"
              onChange={clearModel}
            />
            <br />
            <br />
            <FormItem
              label="姓名"
              name="name"
              required
            >
              <Input v-model:value={formModel.name!.value} />
            </FormItem>
            <FormItem
              label="年龄"
              name="age"
              required
            >
              <Input v-model:value={formModel.age!.value} />
            </FormItem>
            <FormItem
              label="性别"
              name="sex"
              required
            >
              <RadioGroup
                v-model:value={formModel.sex!.value}
                options={sex}
              />
            </FormItem>

            <FormItem
              label="城市"
              name="city"
            >
              <Select
                v-model:value={formModel.city!.value}
                options={cities}
                mode="multiple"
                placeholder={"请选择城市"}
              />
            </FormItem>

            <FormItem
              label="爱好"
              name="hobbies"
            >
              <CheckboxGroup
                v-model:value={formModel.hobbies!.value}
                options={hobbies}
              />
            </FormItem>

            {formModel.income?.isShow?.() ? (
              <FormItem
                label="收入"
                name="income"
              >
                <Input v-model:value={formModel.income!.value} />
              </FormItem>
            ) : null}

            <Flex justify="end">
              <Space align="end">
                <Button
                  type="primary"
                  onClick={handleSubmitForm}
                >
                  提交
                </Button>
                <Button onClick={loadFormData}>初始化</Button>
                <Button onClick={clearModel}>清空</Button>
              </Space>
            </Flex>

            <hr />

            <Space.Compact>
              <Input
                v-model:value={keyOfModel.value}
                placeholder={"输入表单key打印其值"}
              />
              <Button
                onClick={() =>
                  message.info(`key：${keyOfModel.value}，value：${getFormValueByField(keyOfModel.value)}`)
                }
              >
                打印
              </Button>
            </Space.Compact>
          </Form>
        </Spin>
      </IPanel>
    );
  },
});

export default FormPage;
