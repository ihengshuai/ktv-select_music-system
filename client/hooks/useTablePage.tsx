import { isBoolean, isEmpty as isEmptyObject, isFunction, isUndefined } from "@hengshuai/helper";
import { TableProps } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { Key, SortOrder, TablePaginationConfig } from "ant-design-vue/es/table/interface";
import { Ref, UnwrapNestedRefs, computed, reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { LIST_SORTER, TABLE_SORT } from "@/constants/common";
import { IListQuery, IListResult, IPager, ITableFilter, ITableFilterItem } from "@/typings/common/table";
import { IDict } from "@/typings/common/type";
import { omit, queryToStrURL } from "@/util";

export interface IUseTablePage<R extends IDict<any> = any, Q extends IDict<any> = R> {
  /**
   * 是否追踪路由
   * @default true
   */
  trace?: boolean;
  /**
   * 追踪路由模式
   * @default push
   */
  traceMode?: "push" | "replace";
  /** 表格列 */
  columns: ColumnsType;
  /**
   * 表格过滤条件验证器,结合表单搜索使用
   */
  filters?: UnwrapNestedRefs<ITableFilter>;
  /** 分页过滤条件变化时是否更新分页 */
  pageUpdateOnFilterChange?: boolean;
  /**
   * 分页过滤条件验证器
   */
  pager?: UnwrapNestedRefs<ITableFilter>;
  /** 分页器设置 */
  pagination?: (pagination: TablePaginationConfig) => TablePaginationConfig;
  /**
   * 内置默认排序规则,可定义排序
   */
  sorter?: UnwrapNestedRefs<ITableFilter>;
  /** 表格其它属性 */
  tableProps?: TableProps;
  /** 表格是否可选 */
  selectable?: boolean;
  /** 加载表格数据 */
  fetchData: (query: IListQuery<Q & Omit<IPager, "total">>) => Promise<IListResult<R>>;
}

/**
 * 封装表格页面基本逻辑,将过滤条件、分页、排序反映到url中,提高开发效率
 * 对于简单的通用的表格场景,提供columns、filters、loadRecords足够了
 * @example
 * // 表格查询条件
 * const filters = reactive<ITableFilter<IUserListFilter>>({
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

   // 表格项
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
    ]);

    const { isEmpty, isFetchEnd, tableProps, onSearch } = useTablePage<IUser, IUserListFilter>({
        selectable: true,
        columns: columns.value,
        filters,
        tableProps: {
          showSorterTooltip: { title: " 点击排序" },
          // 其它...
        },
        pagination: {
          showTotal: (total, [begin, end]) => `共 ${total} 条记录 第 ${begin} - ${end} 条`,
          // 其它...
        },
        fetchData: fetchUsers,
    });
 */
export function useTablePage<R extends IDict<any>, Q extends IDict<any> = R>(props: IUseTablePage<R, Q>) {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const storage: IDict<any> = {};
  const traceMode = props.traceMode || "push";
  // 当没有请求时不会显示loading
  const requestPendingList = ref<string[]>([]);
  let isStrict = true;
  let isUserImmeFiltersUpdated = false;

  const { columns, tableProps: _tableProps, fetchData } = props;
  const tableRef = ref<HTMLElement>();

  // 查询条件
  const filters = reactive<ITableFilter>({ ...props.filters });
  // 分页
  const pager = reactive<ITableFilter>({
    page: {
      value: null,
      defaultValue: 1,
      type: Number,
      immediate: true,
      validate: v => v >= 1,
      transform: v => v >> 0,
    },
    size: {
      value: null,
      defaultValue: 10,
      type: Number,
      immediate: true,
      validate: v => v >= 1,
      transform: v => v >> 0,
    },
    ...props.pager,
  });
  // 排序
  const sorterList = computed<Array<string>>(() => columns.filter(item => item.sorter).map(item => item.key as string));
  const sorter = reactive<ITableFilter>({
    orderBy: {
      value: null,
      immediate: true,
      validate: (value: string, item: ITableFilterItem, filters: ITableFilter, query: IDict<string>) =>
        (query.order && sorterList.value.includes(value)) as boolean,
    },
    order: {
      value: null,
      immediate: true,
      validate: (v, item, { orderBy }) => {
        const valid = v && orderBy.value && [LIST_SORTER.ASC, LIST_SORTER.DESC].includes(v);
        return valid;
      },
    },
    ...props.sorter,
  });
  const sort = computed<SortOrder | boolean>(() => {
    let order: boolean | SortOrder = false;

    switch (sorter.order.value) {
      case LIST_SORTER.ASC:
        order = TABLE_SORT.ASC;
        break;
      case LIST_SORTER.DESC:
        order = TABLE_SORT.DESC;
        break;
    }

    return order;
  });

  const pagination = computed<TablePaginationConfig>(() => {
    const {
      page: { value: current },
      size: { value: pageSize, defaultValue: defaultSize },
    } = pager;

    const size = pageSize || defaultSize;
    const defaultPagination: TablePaginationConfig = {
      current: isEmptyObject(current) || current > Math.ceil(total.value / pageSize) ? 1 : current,
      pageSize: size,
      total: total.value,
      showTotal: (total, [begin, end]) => t("table.total", { begin, end, total }),
    };
    return props.pagination?.(defaultPagination) || defaultPagination;
  });
  const conditionQuery = computed<ITableFilter>(() => ({ ...filters, ...pager, ...sorter }));
  const conditions = computed<Array<[string, ITableFilterItem]>>(() => Object.entries(conditionQuery.value));
  const _columns = computed(() => columns.map(item => ({ ...item, sortOrder: getOrder(item.key as any) })));

  // 表格选择
  const selection = reactive({
    selectedRowKeys: [] as Key[],
  });

  const hasFetched = ref(false);
  const tableLoading = ref(false);
  const dataSource: Ref<R[]> = ref([]);
  const total = ref(0);
  const isEmpty = computed(() => hasFetched.value && dataSource.value?.length === 0);
  const isFetchEnd = computed(
    () => !isEmpty.value && hasFetched.value && pager.size.value * pager.page.value >= total.value
  );

  // 表格相关属性
  const tableProps = computed<TableProps>(() => ({
    ref: tableRef,
    rowKey: (row: any) => row.id,
    columns: _columns.value,
    loading: tableLoading.value,
    dataSource: dataSource.value,
    pagination: pagination.value,
    onChange: onTableChange,
    ..._tableProps,
    ...(props.selectable
      ? {
          rowSelection: {
            selectedRowKeys: selection.selectedRowKeys,
            onChange: onSelectChange,
            ...props.tableProps?.rowSelection,
          },
        }
      : null),
  }));

  laucher();

  // 查询条件
  function getFilterValue(): IListQuery<Q> {
    const _query: any = {};
    conditions.value.forEach(([k, l]) => {
      let value = l.immediate ? l.value : storage[k];
      if (l.transform) {
        value = l.transform(value, l, conditionQuery.value, route.query);
      } else if (l.type === Boolean && isBoolean(value)) {
        value = Number(value);
      }

      if (!isEmptyObject(value, false)) {
        _query[k] = value;
      }
    });
    return _query;
  }

  function onSelectChange(selectedRowKeys: Key[]) {
    selection.selectedRowKeys = selectedRowKeys;
  }

  function onTableChange(pagination: TablePaginationConfig, filters: any, _sorter: any): void {
    isUserImmeFiltersUpdated = false;
    const { orderBy: orderByItem, order: orderItem } = sorter;
    let orderBy = null;
    let order = null;
    let current = pagination.current;
    if (_sorter.order) {
      orderBy = _sorter.columnKey || _sorter.field;
      order = _sorter.order === TABLE_SORT.ASC ? LIST_SORTER.ASC : LIST_SORTER.DESC;
    }

    if (orderByItem.value !== orderBy || orderItem.value !== order) {
      orderByItem.value = orderBy;
      orderItem.value = order;
      if (props.pageUpdateOnFilterChange !== false) {
        current = 1;
      }
    }
    const { pageSize } = pagination;
    if (pageSize) pager.size.value = pageSize;

    onPageIndexChange(current);
  }

  // 分页改变
  function onPageIndexChange(
    page = props.pageUpdateOnFilterChange !== false ? 1 : pager.page.value,
    trace = true
  ): void {
    pager.page.value = page;
    search(trace);
  }

  function search(trace = true) {
    isStrict = false;
    updateRoute(trace);
  }

  // 主动搜索
  function onSearch(trace = true): void {
    conditions.value.forEach(([key, item]) => {
      if (!item.immediate) {
        storage[key] = item.value;
      }
    });
    onPageIndexChange(props.pageUpdateOnFilterChange !== false ? 1 : pager.page.value, trace);
  }

  async function load(isManual = false) {
    try {
      pushRequestList();
      handleResult(await fetchData(getFilterValue()));
    } finally {
      hasFetched.value = true;
      isUserImmeFiltersUpdated = true;
      popRequestList();

      if (isManual && !dataSource.value.length && pager.page.value !== 1) {
        onPageIndexChange(pager.page.value - 1);
      }
    }
  }

  function handleResult(data: IListResult<R>) {
    const { items, pager: _pager } = data;
    total.value = _pager.total;
    dataSource.value = items;
    pager.page.value = _pager.page;
    pager.size.value = _pager.size;
    return data;
  }

  function updateRoute(trace = true) {
    const routeQuery: IDict<any> = {};
    const { query } = route;

    conditions.value.forEach(([key, item]) => {
      let value = null;
      // 有些值在转成路由参数时需要转换下,一般在有parse时执行transform转换
      if (item.parse && item.transform) {
        value = item.transform(item.value, item, conditionQuery.value, query);
      } else {
        value = item.immediate ? item.value : storage[key];
      }
      routeQuery[key] =
        isEmptyObject(value) ||
        (value ===
          (isFunction(item.defaultValue)
            ? item.defaultValue(value, item, conditionQuery.value, query)
            : item.defaultValue) &&
          !query[key])
          ? null
          : value;
    });

    if (!trace) isStrict = false;

    const newURL = queryToStrURL(route.fullPath, routeQuery);
    if (props.trace === false || newURL === route.fullPath || newURL === decodeURIComponent(route.fullPath)) {
      isStrict = true;
      load();
    } else {
      router[traceMode](newURL);
    }
  }

  function parseRoute() {
    const { query } = route;
    const _isStrict = isStrict;

    isStrict = true;

    const requiredNormalizeURL =
      conditions.value.filter(([key, item]) => {
        let _value: any = query[key] as string;
        if (!isEmptyObject(_value, false)) {
          _value = decodeURIComponent(_value);
          let isValid = true;

          switch (item.type) {
            case Number:
              if (/^-?\d+/gi.test(_value)) {
                _value = (_value as number) >> 0;
              } else {
                isValid = false;
              }
              break;
            case Boolean:
              if (/^(true|false)$/i.test(_value)) {
                _value = _value === "true";
              } else {
                isValid = false;
              }
              break;
          }

          if (isValid && (!item.validate || item.validate?.(_value, item, conditionQuery.value, query))) {
            isUserImmeFiltersUpdated = false;
            const beautifyValue = item.parse?.(_value, item, conditionQuery.value, query);
            _value = isUndefined(beautifyValue) ? _value : beautifyValue;
            item.value = _value;
            if (item?.autoStorage !== false) {
              storage[key] = _value;
            }
          } else {
            item.value = null;
            return true;
          }
        } else {
          item.value = null;
        }
        return false;
      }).length > 0;

    if (_isStrict && requiredNormalizeURL) {
      updateRoute(false);
    } else {
      conditions.value.forEach(([key, item]) => {
        if (isEmptyObject(item.value, false)) {
          item.value = isEmptyObject(item.defaultValue)
            ? null
            : isFunction(item.defaultValue)
            ? item.defaultValue(item.value, item, conditionQuery.value, query)
            : item.defaultValue;
        }
        if (!item.immediate) {
          storage[key] = item.value;
        }
      });
      load();
    }
  }

  function getOrder(key: string) {
    const {
      orderBy: { value: orderBy },
      order: { value: order },
    } = sorter;
    return orderBy && order && orderBy === key ? sort.value : (null as any);
  }

  function resetSearch() {
    isUserImmeFiltersUpdated = false;
    const query = omit(route.query || {}, ...Object.keys(filters), ...Object.keys(sorter), ...Object.keys(pager));
    router.push({ ...route, query });
  }

  function laucher() {
    watch(route, parseRoute, { flush: "post", immediate: true });

    const immediateFilters = Object.entries(props.filters || {})
      // eslint-disable-next-line no-unused-vars
      .filter(([k, v]) => !!v.immediate)
      // eslint-disable-next-line no-unused-vars
      .map(([k, v]) => v);
    immediateFilters?.length &&
      watch(immediateFilters, () => isUserImmeFiltersUpdated && onSearch(), { flush: "post" });

    watchEffect(() => {
      if (!requestPendingList.value.length) {
        tableLoading.value = false;
      } else {
        tableLoading.value = true;
      }
    });
  }

  function pushRequestList() {
    requestPendingList.value.push("");
  }
  function popRequestList() {
    requestPendingList.value.pop();
  }

  function toggleLoading() {
    requestPendingList.value = [];
    tableLoading.value = !tableLoading.value;
  }

  return {
    tableRef,
    total,
    isEmpty,
    isFetchEnd,
    dataSource,
    tableLoading,
    tableProps,
    selection,
    getFilterValue,
    getOrder,
    onSearch,
    onSelectChange,
    onTableChange,
    resetSearch,
    toggleLoading,
    refresh: load,
  };
}
