import { Table } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { defineComponent, ref } from "vue";

import { fetchUsers } from "@/api/mock";
import IPanel from "@/components/common/panel";
import { useTablePage } from "@/hooks";
import { IUser, IUserListFilter } from "@/typings/models/user";

const TableBasePage = defineComponent({
  name: "TableBasePage",
  setup() {
    const columns = ref<ColumnsType<IUser>>([
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "名字",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "年龄",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "性别",
        dataIndex: "sex",
        key: "sex",
        customRender: ({ text }) => {
          return text === "male" ? "男" : "女";
        },
      },
    ]);

    const { tableProps } = useTablePage<IUser, IUserListFilter>({
      trace: false,
      columns: columns.value,
      fetchData: fetchUsers,
    });

    return () => (
      <IPanel size="small">
        <Table {...tableProps.value} />
      </IPanel>
    );
  },
});

export default TableBasePage;
