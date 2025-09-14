import "./index.less";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { Avatar, Button, Form, Input, message, Space, Tag, Upload } from "ant-design-vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { uploadResourceAPI } from "@/api/static/static.api";
import { UserController } from "@/api/user";
import IPanel from "@/components/common/panel";
import { useConfig } from "@/config";
import { FileType } from "@/constants/file";
import { ROUTE_NAME } from "@/constants/route";
import { USER_ROLE, USER_STATUS } from "@/constants/user";
import { getEnumEntity } from "@/helper/get-enum-entity";
import { useFormPage } from "@/hooks";
import { useUserStore } from "@/store";
import { IFormModel, IFormRules } from "@/typings/common/form";
import { IUserInfoUpdateDTO } from "@/typings/models/user";

interface IUploadState {
  loading: boolean;
  uploadAvatarURL: string | null;
  uploadAvatarId: number | null;
}

const PersonalPage = defineComponent({
  name: "PersonalPage",
  setup() {
    const userController = new UserController();

    const { APP_ID } = useConfig();
    const router = useRouter();
    const userStore = useUserStore();

    const isEditing = ref(false);
    const formModel = reactive<IFormModel<IUserInfoUpdateDTO>>({
      nickname: { value: userStore.userState.user?.nickname! },
      avatar: { value: userStore.userState.user?.avatar! },
    });
    const uploadState = reactive<IUploadState>({
      loading: false,
      uploadAvatarURL: null,
      uploadAvatarId: null,
    });
    const uploadAvatar = computed(() => uploadState?.uploadAvatarURL || userStore.userState.user?.avatarURL!);
    const formRules: IFormRules<IUserInfoUpdateDTO> = {
      nickname: {
        validator: (rule, { value }) => {
          const v = value?.trim();
          if (!v) {
            return Promise.reject("昵称不能为空");
          } else if (v.length < 2 || v.length > 10) {
            return Promise.reject("昵称长度在2-10位之间");
          } else {
            return Promise.resolve();
          }
        },
      },
    };

    const { formRef, formLoading, formProps, handleSubmitForm } = useFormPage<IUserInfoUpdateDTO>({
      formModel,
      formRules,
      baseProps: {
        colon: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 10 },
      },
      initFormData: async x => x!,
      onSubmit: submitForm,
    });

    async function submitForm(payload: IUserInfoUpdateDTO) {
      const res = await userController.updateUserNickname(payload);

      if (res) {
        message.success("保存成功");
        userStore.userState.user!.nickname = payload.nickname!;
        userStore.userState.user!.avatarURL = uploadState.uploadAvatarURL!;
        userStore.userState.user!.avatar = uploadState.uploadAvatarId!;
        isEditing.value = false;

        clearFormState();
      }
    }

    async function onBeforeUpload(file: File) {
      try {
        uploadState.loading = true;
        const res = await uploadResourceAPI({ type: FileType.IMAGE, file, appId: APP_ID });

        if (res) {
          message.success("上传成功");
          uploadState.uploadAvatarId = res.id;
          uploadState.uploadAvatarURL = res.url;
          formModel.avatar!.value = res.id;
        }

        return false;
      } finally {
        uploadState.loading = false;
        return false;
      }
    }

    function clearFormState() {
      uploadState.loading = false;
      uploadState.uploadAvatarId = null;
      uploadState.uploadAvatarURL = null;
    }

    function goChangePwdPage() {
      router.push({ name: ROUTE_NAME.userPassword });
    }

    return () => {
      const HeaderExtra = () => (
        <>
          {!isEditing.value ? (
            <Space>
              <Button onClick={goChangePwdPage}>修改密码</Button>
              <Button
                type="primary"
                onClick={() => (isEditing.value = true)}
              >
                编辑
              </Button>
            </Space>
          ) : (
            <Space>
              <Button onClick={() => (isEditing.value = false)}>取消</Button>
              <Button
                loading={formLoading.value}
                type="primary"
                onClick={handleSubmitForm}
              >
                确定
              </Button>
            </Space>
          )}
        </>
      );

      return (
        <IPanel extra={<HeaderExtra />}>
          <Form
            ref={formRef}
            {...formProps.value}
          >
            <Form.Item label="头像">
              <Upload
                maxCount={1}
                disabled={!isEditing.value}
                show-upload-list={false}
                name="avatar"
                accept="image/*"
                class="avatar-uploader"
                beforeUpload={onBeforeUpload}
              >
                {uploadAvatar.value ? (
                  <img
                    src={uploadAvatar.value}
                    class={"avatar-uploader-img"}
                    alt="avatar"
                  />
                ) : (
                  <Avatar
                    icon={"无"}
                    style="width:40px;height:40px;margin:10px;line-height:36px;background-color: #87d068"
                  />
                )}
                {isEditing.value && (
                  <div class="upload-btn">{uploadState.loading ? <LoadingOutlined /> : <PlusOutlined />}</div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item label="账号">
              <div>{userStore.userState.user?.username}</div>
            </Form.Item>

            <Form.Item label="身份">
              <div>{getEnumEntity(USER_ROLE, userStore.userState.user?.level).alias}</div>
            </Form.Item>

            <Form.Item
              label="昵称"
              name="nickname"
            >
              {!isEditing.value ? (
                <div>{userStore.userState.user?.nickname}</div>
              ) : (
                <Input v-model:value={formModel.nickname!.value} />
              )}
            </Form.Item>

            <Form.Item label="状态">
              <Tag color={userStore.userState.user?.status! === USER_STATUS.ACTIVE ? "success" : "gray"}>
                {getEnumEntity(USER_STATUS, userStore.userState.user?.status!).alias}
              </Tag>
            </Form.Item>
          </Form>
        </IPanel>
      );
    };
  },
});

export default PersonalPage;
