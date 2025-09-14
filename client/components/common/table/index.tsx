import { isFunction } from "@hengshuai/helper";
import { Spin, Table } from "ant-design-vue";
import { ColumnType, TableProps, tableProps as tableSelfProps } from "ant-design-vue/es/table";
import { Key } from "ant-design-vue/es/table/interface";
import {
  PropType,
  SlotsType,
  VNode,
  computed,
  defineComponent,
  // getCurrentInstance,
  // nextTick,
  // onMounted,
  ref,
  // watch,
  // watchEffect,
} from "vue";
import { useI18n } from "vue-i18n";

import { ITableBodyCell, ITableHeaderCell } from "@/typings/common/table";
import { omit, pick, useNameSpace } from "@/util";

import IPagination, { IPaginationProps } from "../pagination";
import ITableHeader, { ITableHeaderProps } from "./components/table-header";
import ITableOperator, { ITableOperatorProps } from "./components/table-operator";

import "./index.less";

export const ITableSlots = Object as SlotsType<{
  bodyCell?: (props: ITableBodyCell) => any;
  headerCell?: (props: ITableHeaderCell) => any;
  paginationPrefix?: () => any;
  paginationSuffix?: () => any;
}>;

export const ITableProps = {
  // table
  ...tableSelfProps(),
  // 操作列
  ...omit(ITableOperatorProps, "bodyCell"),
  // pagination
  paginationAlign: pick(IPaginationProps, "align").align,
  // header
  ...ITableHeaderProps,

  loadingTip: {
    type: String,
    default: null,
  },
  title: {
    type: [String, Function] as PropType<string | ((props: any[]) => any)>,
  },
  titleTip: {
    type: [String, Object] as PropType<string | VNode>,
    default: null,
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
  wrapclass: {
    type: String,
  },
};

const cls = useNameSpace("table");

const ITable = defineComponent({
  name: "ITable",
  props: ITableProps,
  setup(props, { slots, attrs }) {
    const { t } = useI18n();

    const tableProps = computed(() => {
      return omit(pick(props, ...(Object.keys(tableSelfProps()) as any)) as TableProps, "pagination", "title");
    });

    const tableCls = computed(() => {
      return [cls.b(), props.wrapclass];
    });

    const tableSize = ref(props.size || "middle");

    const showOperator = computed(() => {
      return props.operations.length > 0;
    });

    const tableColumns = computed(() => {
      const columns = props.columns;
      const hasOperator = columns.filter(column => column.key === "operation").length > 0;
      if (!hasOperator && showOperator.value) {
        columns.push({
          title: t("common.operation"),
          key: "operation",
          align: "center",
        });
      }
      return columns;
    });

    // const ins = getCurrentInstance();
    // TODO: table fixed scroll
    // const scroll = ref();
    // function updateTableScroll() {
    //   nextTick(() => {
    //     const table = ins?.proxy?.$el.querySelector(".ant-table-content");
    //     console.log(table.offsetHeight);
    //     scroll.value = {
    //       x: 1300,
    //       y: table?.offsetHeight,
    //     };
    //   });
    // }
    // watch(() => props.loading, updateTableScroll);

    const columnsQuery = computed(() => {
      const res: Partial<Record<Key, ColumnType>> = {};
      tableColumns.value.length &&
        tableColumns.value.forEach(item => {
          res[item.key as Key] = item;
        });
      return res;
    });

    // 操作列
    const operations = (bodyCellProps: ITableBodyCell) =>
      // 优先显示自定义渲染
      columnsQuery.value["operation"]?.customRender ? (
        columnsQuery.value["operation"]?.customRender(bodyCellProps as any)
      ) : (
        <ITableOperator
          operations={props.operations}
          bodyCell={bodyCellProps}
          operateCollapseMin={props.operateCollapseMin}
        />
      );

    // pagination变化时触发
    const onPaginationChange = (current: number, pageSize: number) => {
      const [sortColumn] = props.columns.filter(column => column.sorter && column.sortOrder) || [];
      props.onChange(
        { current, pageSize },
        {},
        { columnKey: sortColumn?.key, field: sortColumn?.key, order: sortColumn?.sortOrder },
        {} as any
      );
    };

    return () => {
      return (
        <Spin
          spinning={props.loading as boolean}
          tip={props.loadingTip}
        >
          <Table
            {...tableProps.value}
            columns={tableColumns.value}
            size={tableSize.value}
            pagination={false}
            loading={false}
            class={tableCls.value}
            {...attrs}
          >
            {{
              bodyCell: (bodyCellProps: ITableBodyCell) => {
                if (showOperator.value && bodyCellProps.column.key === "operation") return operations(bodyCellProps);
                return slots.bodyCell?.(bodyCellProps);
              },
              title: (data: any) => {
                const title = isFunction(props.title) ? props.title?.(data) : props.title;
                const toolbar = slots.toolbar?.();
                return (
                  (props.showTitle || title || toolbar) && (
                    <ITableHeader
                      onSizeChange={size => (tableSize.value = size!)}
                      size={tableSize.value}
                      defaultTool={props.defaultTool}
                      v-slots={{
                        title: title && (() => title),
                        titleTip: props.titleTip && (() => props.titleTip),
                        toolbar: () => toolbar,
                      }}
                    />
                  )
                );
              },
            }}
          </Table>

          {/* 分页 */}
          {props.pagination && props.dataSource?.length > 0 && (
            <IPagination
              {...props.pagination}
              align={props.paginationAlign}
              onChange={onPaginationChange}
            >
              {{
                prefix: slots.paginationPrefix,
                suffix: slots.paginationSuffix,
              }}
            </IPagination>
          )}
        </Spin>
      );
    };
  },
});

export default ITable;
