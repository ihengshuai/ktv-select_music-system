import { Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import { useI18n } from "vue-i18n";

import { getStaticResourceListAPI, deleteFileAPI } from "@/api/static/static.api";
import IPanel from "@/components/common/panel";
import ITable from "@/components/common/table";
import { TABLE_OPERATION } from "@/constants/common";
import { USER_ROLE } from "@/constants/user";
import { useTablePage } from "@/hooks";
import { useUserStore } from "@/store";
import { IOperation } from "@/typings/common/table";
import { IStaticVO } from "@/typings/models/static/static";

import { createStaticColumns, createStaticTableFilters } from "./helper";
import StaticTableSearch from "./widgets/static-table-search";

const StaticManagerPage = defineComponent({
  setup() {
    const { t } = useI18n();

    const filters = reactive(createStaticTableFilters());
    const columns = createStaticColumns();
    const userStore = useUserStore();

    const operations: Array<IOperation<IStaticVO>> = [
      {
        key: TABLE_OPERATION.DELETE,
        value: t("delete"),
        buttonProps: {
          type: "link",
          danger: true,
        },
        handler: ({ record }) => handleDelete(record),
        validator: ({ record }) =>
          record.uid === userStore.userState.user?.uid || userStore.userState.user?.level === USER_ROLE.SUPER,
      },
    ];

    const { tableProps, onSearch, resetSearch, refresh } = useTablePage<IStaticVO>({
      filters,
      columns,
      pager: {
        size: {
          value: null,
          defaultValue: 15,
          type: Number,
          immediate: true,
          validate: v => v >= 1,
          transform: v => v >> 0,
        },
      },
      fetchData: getStaticResourceListAPI,
    });

    async function handleDelete(row: IStaticVO) {
      Modal.confirm({
        title: "警告",
        content: "确定要删除该文件吗,此操作不可逆,是否继续?",
        onOk: async () => {
          await deleteFileAPI(row.id);

          refresh();
        },
      });
    }

    return () => (
      <IPanel
        title={
          <>
            <StaticTableSearch
              filters={filters}
              onSearch={onSearch}
              onReset={resetSearch}
            />
          </>
        }
      >
        <ITable
          {...tableProps.value}
          operations={operations}
        />
      </IPanel>
    );
  },
});

export default StaticManagerPage;
