import { Tag } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";

import { YoN } from "@/constants/common";
import { IEnumCodeVO } from "@/typings/models/enum-code/enum-code";

export function createEnumCodeTableColumn() {
  const columns: ColumnsType<IEnumCodeVO> = [
    {
      dataIndex: "code",
      key: "code",
      title: "枚举键",
      width: 180,
    },
    {
      dataIndex: "value",
      key: "value",
      title: "枚举值",
      width: 180,
    },
    {
      dataIndex: "status",
      key: "status",
      title: "状态",
      customRender: ({ value }) => (value === YoN.Y ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>),
    },
    {
      dataIndex: "remark",
      key: "remark",
      title: "备注",
    },
    {
      dataIndex: "createTime",
      key: "createTime",
      title: "创建时间",
    },
    {
      dataIndex: "updateTime",
      key: "updateTime",
      title: "更新时间",
    },
  ];

  return columns;
}
