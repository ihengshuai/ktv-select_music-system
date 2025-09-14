import { Table } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { defineComponent, ref } from "vue";

import { fetchUsers } from "@/api/mock";
import IPanel from "@/components/common/panel";
import { useTablePage } from "@/hooks";
import { IUser, IUserListFilter } from "@/typings/models/user";

const TableRouteMapPage = defineComponent({
  name: "TableRouteMapPage",
  setup() {
    const columns = ref<ColumnsType<IUser>>([
      {
        title: "ID",
        dataIndex: "id",
        sorter: true,
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
        sorter: true,
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
      columns: columns.value,
      tableProps: {
        showSorterTooltip: { title: " 点击排序" },
      },
      fetchData: fetchUsers,
    });

    return () => (
      <IPanel withCard>
        <Table {...tableProps.value} />
      </IPanel>
    );
  },
});

export default TableRouteMapPage;
