import { Button, Form, FormItem, Input, Select, Space } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

import { fetchUsers } from "@/api/mock";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { useTablePage } from "@/hooks";
import { ITableFilter } from "@/typings/common/table";
import { IUser, IUserListFilter } from "@/typings/models/user";

const sexOpts = [
  { label: "男", value: "male" },
  { label: "女", value: "remale" },
  { label: "全部", value: "-1" },
];

const TableFormPage = defineComponent({
  name: "TableFormPage",
  setup() {
    const { t } = useI18n();
    const filters = reactive<ITableFilter<IUserListFilter>>({
      keywords: {
        value: null,
        defaultValue: "",
        validate: v => isNaN(parseInt(v)),
      },
      sex: {
        value: null,
        defaultValue: "male",
        immediate: true,
        validate: v => ["male", "remale", "-1"].includes(v),
        transform: v => (v === "-1" ? null : v),
      },
    });
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

    // @ts-ignore
    const { isEmpty, isFetchEnd, tableProps, onSearch, resetSearch } = useTablePage<IUser, IUserListFilter>({
      columns: columns.value,
      filters,
      tableProps: {
        showSorterTooltip: { title: " 点击排序" },
      },
      pagination: prev => ({
        ...prev,
        showTotal: (total, [begin, end]) => `共 ${total} 条记录 第 ${begin} - ${end} 条`,
      }),
      fetchData: fetchUsers,
    });

    return () => {
      const TableForm = (
        <Form class="table-form">
          <Space>
            <FormItem name={"keywords"}>
              <Input
                v-model:value={filters.keywords!.value}
                placeholder={"请输入关键字"}
                allowClear
                style={"width: 200px"}
                onPressEnter={onSearch as any}
              />
            </FormItem>
            <FormItem name={"sex"}>
              <Select
                v-model:value={filters.sex!.value}
                options={sexOpts}
                style={"width: 100px"}
              />
            </FormItem>
            <strong>{isEmpty?.value && "没数据"}</strong>
            <strong>{isFetchEnd?.value && "加载完毕"}</strong>
          </Space>
        </Form>
      );
      const TableFormAction = (
        <>
          <Button
            type="link"
            onClick={resetSearch}
          >
            {t("reset")}
          </Button>
          <Button
            type="primary"
            onClick={onSearch as any}
          >
            {t("search")}
          </Button>
        </>
      );
      return (
        <IPanel
          withCard
          title={TableForm}
          extra={TableFormAction}
        >
          <ITable {...tableProps.value} />
        </IPanel>
      );
    };
  },
});

export default TableFormPage;
