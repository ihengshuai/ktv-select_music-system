import { Button, Form, FormItem, InputPassword, message, Modal, Select, Tag } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
// @ts-ignore
import md5 from "md5";
import { defineComponent, reactive, ref, watchEffect } from "vue";

import { UserController } from "@/api/user";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { USER_ROLE, USER_STATUS } from "@/constants/user";
import { getEnumEntity, getEnumOptions } from "@/helper";
import { useTablePage } from "@/hooks";
import { useUserStore } from "@/store";
import { IOperation } from "@/typings/common/table";
import { IUserInfo, IUserListFilter } from "@/typings/models/user";

/** 默认密码 */
const DEFAULT_PASSWORD = "123456";

interface IChangeUserRoleState {
  showModal: boolean;
  loading: boolean;
  roleOpts: any[];
  role: USER_ROLE | null;
  user: IUserInfo | null;
}

const UserManagePage = defineComponent({
  name: "UserManagePage",
  setup() {
    const userController = new UserController();
    const userStore = useUserStore();

    const resetPwdState = reactive({
      showModal: false,
      loading: false,
      password: "",
      username: "",
    });

    const changeUserRoleState = reactive<IChangeUserRoleState>({
      showModal: false,
      loading: false,
      roleOpts: [],
      role: null,
      user: null,
    });

    const columns = ref<ColumnsType<IUserInfo>>([
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "账号",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "昵称",
        dataIndex: "nickname",
        key: "nickname",
      },
      {
        title: "角色",
        dataIndex: "level",
        key: "level",
        customRender: ({ text }) => getEnumEntity(USER_ROLE, text).alias,
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        customRender: ({ text }) => (
          <Tag color={text === USER_STATUS.ACTIVE ? "success" : "gray"}>{getEnumEntity(USER_STATUS, text).alias}</Tag>
        ),
      },
    ]);

    const operations: IOperation<IUserInfo>[] = [
      {
        key: TABLE_OPERATION.TOGGLE_STATUS,
        disabled: ({ record }) => record.level === USER_ROLE.SUPER || userStore.userState.user?.level! >= record.level,
        buttonProps: {
          type: "link",
          danger: true,
        },
        value: ({ record }) =>
          userStore.userState.user?.level! <= record.level
            ? record.status === USER_STATUS.ACTIVE
              ? "禁用"
              : "激活"
            : "-",
        handler: ({ record }) => toggleUserStatus(record),
      },
      {
        key: TABLE_OPERATION.CHANGE_ROLE,
        validator: ({ record }) => record.level !== USER_ROLE.SUPER,
        disabled: ({ record }) => userStore.userState.user?.level! >= record.level,
        value: "权限",
        handler: ({ record }) => changeUserRole(record),
      },
      {
        key: TABLE_OPERATION.RESET_PASSWORD,
        validator: ({ record }) => record.level !== USER_ROLE.SUPER,
        disabled: ({ record }) => record.level === USER_ROLE.SUPER || userStore.userState.user?.level! >= record.level,
        value: "重置密码",
        handler: ({ record }) => resetPassword(record),
      },
    ];

    // @ts-ignore
    const { tableProps, refresh } = useTablePage<IUserInfo, IUserListFilter>({
      columns: columns.value,
      fetchData: getUsers,
    });

    async function getUsers() {
      const res = await userController.fetchUsers();
      return res;
    }

    async function toggleUserStatus(payload: IUserInfo) {
      let status: USER_STATUS;

      Modal.confirm({
        title: "确认操作?",
        content: `${
          payload.status !== USER_STATUS.ACTIVE
            ? "确认激活该用户吗?"
            : "确认禁用该用户吗？5分钟后该用户将会强制退出或无法登录!"
        }`,
        onOk: async () => {
          if (payload.status !== USER_STATUS.ACTIVE) {
            status = USER_STATUS.ACTIVE;
          } else {
            status = USER_STATUS.BANNED;
          }

          const res = await userController.toggleUserStatus(payload.username, status);

          if (res) {
            message.success("操作成功");
            refresh();
          }
        },
      });
    }

    async function changeUserRole(payload: IUserInfo) {
      changeUserRoleState.user = payload;
      changeUserRoleState.showModal = true;
      changeUserRoleState.role = payload.level;

      const roleOpts = getEnumOptions(USER_ROLE).filter(l => Number(l.value) > userStore.userState.user?.level!);

      changeUserRoleState.roleOpts = roleOpts;
    }

    async function submitChangeRole() {
      try {
        changeUserRoleState.loading = true;
        await userController.toggleUserRole(changeUserRoleState.user!.username, changeUserRoleState.role!);

        message.success("操作成功");
        refresh();
        resetChangeRoleState();
      } finally {
        changeUserRoleState.loading = false;
      }
    }

    function resetChangeRoleState() {
      changeUserRoleState.showModal = false;
      changeUserRoleState.role = null;
      changeUserRoleState.user = null;
      changeUserRoleState.roleOpts = [];
    }

    function resetPassword(payload: IUserInfo) {
      resetPwdState.showModal = true;
      resetPwdState.username = payload.username;
    }

    async function submitResetPwd() {
      try {
        resetPwdState.loading = true;
        const password = resetPwdState.password?.trim() || DEFAULT_PASSWORD;

        const res = await userController.resetUserPassword(resetPwdState.username, md5(password));

        if (res) {
          resetPwdState.showModal = false;
          message.success("操作成功");
        }
      } finally {
        resetPwdState.loading = false;
      }
    }

    watchEffect(() => {
      if (!resetPwdState.showModal) {
        resetPwdState.password = "";
        resetPwdState.username = "";
        resetPwdState.loading = false;
      }
    });

    return () => (
      <IPanel
        title={
          <Button
            type="primary"
            onClick={() => userController.testCaptureError()}
          >
            演示错误
          </Button>
        }
      >
        <ITable
          {...tableProps.value}
          operations={operations}
        />

        <Modal
          v-model:open={resetPwdState.showModal}
          title={"重置密码"}
          onOk={submitResetPwd}
        >
          <Form>
            <FormItem
              label="密码"
              name="password"
            >
              <InputPassword
                v-model:value={resetPwdState.password}
                placeholder={`不填默认 ${DEFAULT_PASSWORD}`}
              />
            </FormItem>
          </Form>
        </Modal>

        <Modal
          title="修改权限"
          v-model:open={changeUserRoleState.showModal}
          destroyOnClose
          onOk={submitChangeRole}
          onCancel={resetChangeRoleState}
        >
          <Form>
            <Form.Item>
              <Select
                v-model:value={changeUserRoleState.role}
                options={changeUserRoleState.roleOpts}
                placeholder="请选择"
              />
            </Form.Item>
          </Form>
        </Modal>
      </IPanel>
    );
  },
});

export default UserManagePage;
