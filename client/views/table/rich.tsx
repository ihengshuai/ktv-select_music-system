import { DeleteOutlined } from "@ant-design/icons-vue";
import { EnumUtils } from "@hengshuai/helper";
import { Button, Form, FormItem, Input, RangePicker, Select, Space, message } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { computed, defineComponent, onActivated, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { fetchUsers } from "@/api/mock";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { COMMON_LABELS, TABLE_OPERATION } from "@/constants/common";
import { ROUTE_NAME } from "@/constants/route";
import { USER_HOBBY, USER_SEX } from "@/constants/user";
import { useTablePage } from "@/hooks";
import { useRequest } from "@/hooks/useRequest";
import { IOperation, ITableFilter } from "@/typings/common/table";
import { IUser, IUserListFilter } from "@/typings/models/user";
import { formatDate, isValidDate, toDayjs } from "@/util/common/date";

const RichTablePage = defineComponent({
  name: "RichTablePage",
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const mixState = reactive({
      defaultTool: true,
      operationCollapse: 0,
      isMockError: 0,
    });

    onActivated(() => console.log("active..."));

    // 使用useRequest模拟出错重试
    const { loading, loadingTip, refresh } = useRequest(requestUser, { manual: true, retry: 5, noticeError: true });

    const sexOpts = computed(() => {
      const opts = EnumUtils.getEntries<string>(USER_SEX).map(({ value, alias }) => ({ label: t(alias), value }));
      const { alias, value } = EnumUtils.getEntry(COMMON_LABELS.ALL as any, COMMON_LABELS);
      opts.unshift({ label: t(alias), value: String(value) });
      return opts;
    });

    const hobbyOpts = computed(() => {
      const opts = EnumUtils.getEntries(USER_HOBBY).map(({ value, alias }) => ({ label: t(alias), value }));
      const { alias, value } = EnumUtils.getEntry(COMMON_LABELS.ALL, COMMON_LABELS);
      opts.unshift({ label: t(alias), value });
      return opts;
    });

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
      hobbies: {
        value: null,
        defaultValue: [COMMON_LABELS.ALL],
        transform: val => val?.join(","),
        parse: val => val?.split(",").map(Number),
      },
      birthRange: {
        value: null,
        immediate: true,
        validate: v => {
          const [begin, end] = v.split(",");
          return isValidDate(begin) && isValidDate(end) && new Date(begin) < new Date(end);
        },
        transform: (val: string[]) => val?.map?.(v => formatDate(v, "YYYY/MM/DD")).join(","),
        parse: (val: string) => val?.split(",")?.map(v => toDayjs(v)),
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
        title: t("common.name"),
        dataIndex: "name",
        key: "name",
      },
      {
        title: t("common.age"),
        dataIndex: "age",
        sorter: true,
        key: "age",
      },
      {
        title: t("common.sex"),
        dataIndex: "sex",
        key: "sex",
        customRender: ({ text }) => {
          return text === "male" ? t("common.male") : t("common.remale");
        },
      },
      {
        title: t("common.hobbies"),
        dataIndex: "hobbies",
        key: "hobbies",
        ellipsis: true,
        customRender: ({ text }) => {
          return text?.map((v: any) => t(EnumUtils.getEntry(v, USER_HOBBY)?.alias)).join(",");
        },
      },
      {
        title: t("common.birthday"),
        key: "createTime",
        customRender: ({ record }) => formatDate(record.createTime!, "YYYY/MM/DD"),
      },
      {
        title: t("common.operation"),
        key: "operation",
        fixed: "right",
        align: "center",
        width: 160,
      },
    ]);

    const operations: IOperation<IUser>[] = [
      {
        key: TABLE_OPERATION.CREATE,
        value: t("create"),
        validator: row => row.record.age !== 10,
        disabled: row => row.record.age! > 10,
        handler: row => message.info("创建" + JSON.stringify(row)),
      },
      {
        key: TABLE_OPERATION.UPDATE,
        value: t("edit"),
        disabled: row => row.record.age! === 16,
        handler: row => {
          router.push({ name: ROUTE_NAME.tableDetail, params: { id: row.record.id } });
        },
      },
      {
        key: TABLE_OPERATION.DELETE,
        value: payload => (payload.record.name === "关羽" ? <DeleteOutlined /> : t("delete")),
        disabled: row => row.record.age! === 16,
        buttonProps: { danger: true, type: "link" },
        handler: row => message.info("删除: " + row.record.id),
      },
    ];

    const {
      isEmpty,
      isFetchEnd,
      // dataSource,
      selection,
      tableProps,
      getFilterValue,
      // toggleLoading,
      onSearch,
      resetSearch,
      // @ts-ignore
    } = useTablePage<IUser, IUserListFilter>({
      selectable: true,
      columns: columns.value,
      filters,
      pagination: prev => ({
        ...prev,
        showQuickJumper: true,
        showSizeChanger: true,
      }),
      // fetchData 用来请求数据，这里可以直接使用请求数据的接口 fetchUsers
      // 这里重写是来模拟 出错重试
      fetchData: async args => {
        const res = await refresh(args);
        // 请求完后 模拟错误参数 置0
        mixState.isMockError = 0;
        return res?.value[0];
      },
    });

    async function requestUser(args: any) {
      return await fetchUsers({ ...args, testCode: !!mixState.isMockError || null }, { captureError: false });
    }

    return () => {
      // 表单
      const tableForm = (
        <Form class="table-form">
          <Space
            wrap
            style={"padding: 16px 0"}
          >
            <FormItem name={"keywords"}>
              <Input
                v-model:value={filters.keywords!.value}
                placeholder={t("common.keywords")}
                allowClear
                style={"width: 200px"}
                onPressEnter={onSearch as any}
              />
            </FormItem>
            <FormItem name={"sex"}>
              <Select
                v-model:value={filters.sex!.value}
                options={sexOpts.value}
                style={"width: 100px"}
              />
            </FormItem>
            <FormItem name={"hobbies"}>
              <Select
                v-model:value={filters.hobbies!.value}
                mode="multiple"
                maxTagCount={2}
                placeholder={t("common.hobby-place")}
                options={hobbyOpts.value}
                style={"width: 220px"}
              />
            </FormItem>
            <FormItem
              name={"createTime"}
              label={t("common.birthday")}
            >
              <RangePicker v-model:value={filters.birthRange!.value} />
            </FormItem>
            <strong>{isEmpty?.value && "没数据"}</strong>
            <strong>{isFetchEnd?.value && "加载完毕"}</strong>
          </Space>
        </Form>
      );
      // 表单表格操作区域
      const tableFormActions = (
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
      );

      return (
        <IPanel
          bodyStyle={{ paddingTop: "2px" }}
          title={tableForm}
          extra={tableFormActions}
        >
          <ITable
            {...tableProps.value}
            // tableLayout="fixed"
            title={"综合功能表"}
            titleTip={"当前表格综合展示各种表格功能(不是全部哈.)"}
            showTitle
            loading={loading.value}
            loadingTip={loadingTip.value!}
            operations={operations}
            operateCollapseMin={mixState.operationCollapse}
            defaultTool={mixState.defaultTool}
            v-slots={{
              toolbar: () => (
                <>
                  <Button
                    type="link"
                    onClick={() => (mixState.isMockError = 1) && onSearch()}
                  >
                    模拟错误
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => message.info(JSON.stringify(getFilterValue()))}
                  >
                    打印表单
                  </Button>
                  <Button
                    type="primary"
                    disabled={!selection.selectedRowKeys.length}
                    onClick={() => message.info("删除" + selection.selectedRowKeys.join(","))}
                  >
                    批量删除
                  </Button>
                  <Button
                    onClick={() =>
                      mixState.operationCollapse === 1
                        ? (mixState.operationCollapse = 0)
                        : (mixState.operationCollapse = 1)
                    }
                  >
                    操作收缩
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => (mixState.defaultTool = !mixState.defaultTool)}
                  >
                    默认工具
                  </Button>
                </>
              ),
            }}
          />
        </IPanel>
      );
    };
  },
});

export default RichTablePage;
