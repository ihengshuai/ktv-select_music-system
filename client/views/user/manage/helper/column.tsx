import { Tag } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";

import { USER_ROLE, USER_STATUS } from "@/constants/user";
import { getEnumEntity } from "@/helper";
import { IUserInfo } from "@/typings/models/user";

export function createUserManageColumns() {
  const columns: ColumnsType<IUserInfo> = [
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
  ];

  return columns;
}
