import { DeleteOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { Button, Compact, Flex, Form, FormItem, Input, Select, Space, message } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

import { fetchUsers } from "@/api/mock";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { useTablePage } from "@/hooks";
import { IOperation, ITableFilter } from "@/typings/common/table";
import { IUser, IUserListFilter } from "@/typings/models/user";

const sexOpts = [
  { label: "男", value: "male" },
  { label: "女", value: "remale" },
  { label: "全部", value: "-1" },
];

const TableOperationsPage = defineComponent({
  name: "TableOperationsPage",
  setup() {
    const { t } = useI18n();
    const operateCollapseMin = ref(0);
    const toggleOperateCollapse = () =>
      operateCollapseMin.value === 0 ? (operateCollapseMin.value = 1) : (operateCollapseMin.value = 0);

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

    const operations: IOperation<IUser>[] = [
      {
        key: TABLE_OPERATION.CREATE,
        buttonProps: {
          size: "small",
          icon: <PlusOutlined />,
          shape: "circle",
          type: "primary",
        },
        validator: row => row.record.age !== 10,
        disabled: row => row.record.age! > 10,
        handler: row => message.info("创建" + JSON.stringify(row)),
      },
      {
        key: TABLE_OPERATION.UPDATE,
        value: t("edit"),
        disabled: row => row.record.age! === 16,
        handler: row => message.info("编辑" + JSON.stringify(row)),
      },
      {
        key: TABLE_OPERATION.DELETE,
        value: payload => (payload.record.name === "关羽" ? <DeleteOutlined /> : t("delete")),
        disabled: row => row.record.age! === 16,
        buttonProps: { danger: true, type: "link" },
        handler: row => message.info("删除" + JSON.stringify(row)),
      },
    ];

    const { isEmpty, isFetchEnd, tableProps, dataSource, onSearch, resetSearch, selection } = useTablePage<
      IUser,
      IUserListFilter
    >({
      selectable: true,
      columns: columns.value,
      filters,
      tableProps: {
        showSorterTooltip: { title: " 点击排序" },
      },
      pagination: prev => ({
        ...prev,
        size: "small",
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, [begin, end]) => `共 ${total} 条记录 第 ${begin} - ${end} 条`,
      }),
      fetchData: fetchUsers,
    });

    return () => {
      return (
        <>
          <IPanel>
            <Flex>
              <Flex flex={1}>
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
              </Flex>
              <Space>
                <Button
                  type="text"
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
              </Space>
            </Flex>
          </IPanel>

          <IPanel
            title={
              <Compact>
                <Button onClick={() => (selection.selectedRowKeys = dataSource.value.map(v => v.id) as any)}>
                  全选
                </Button>
                <Button onClick={() => (selection.selectedRowKeys = [])}>取消</Button>
                <Button
                  type="primary"
                  disabled={!selection.selectedRowKeys.length}
                  onClick={() => message.info("删除" + selection.selectedRowKeys.join(","))}
                >
                  批量删除
                </Button>
              </Compact>
            }
            extra={
              <Button
                type="dashed"
                danger
                onClick={toggleOperateCollapse}
              >
                操作收缩
              </Button>
            }
          >
            <ITable
              {...tableProps.value}
              operations={operations}
              operateCollapseMin={operateCollapseMin.value}
            />
          </IPanel>
        </>
      );
    };
  },
});

export default TableOperationsPage;
