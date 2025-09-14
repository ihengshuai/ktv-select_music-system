import { EllipsisOutlined } from "@ant-design/icons-vue";
import { isFunction } from "@hengshuai/helper";
import { Button, Dropdown, Menu, Space } from "ant-design-vue";
import { MenuInfo } from "ant-design-vue/es/menu/src/interface";
import { PropType, computed, defineComponent, unref } from "vue";

import { TABLE_OPERATION } from "@/constants/common";
import { IOperation, ITableBodyCell } from "@/typings/common/table";
import "./index.less";

export const ITableOperatorProps = {
  /**
   * 表格操作
   * @type {Array<IOperation<any>>}
   */
  operations: {
    type: Array as PropType<IOperation<any>[]>,
    default: () => [],
  },
  bodyCell: {
    type: Object as PropType<ITableBodyCell>,
    default: () => ({}),
  },
  /**
   * 最小操作折叠数(默认不折叠)
   * @default 0
   */
  operateCollapseMin: {
    type: Number as PropType<number>,
    default: 0,
  },
};

/** 表格操作列 */
const ITableOperator = defineComponent({
  name: "ITableOperator",
  props: ITableOperatorProps,
  setup(props) {
    // 合法的操作列
    const validOperations = computed(() => {
      return props.operations.filter(opera => {
        if (isFunction(opera.validator)) {
          return opera.validator(props.bodyCell);
        }
        return true;
      });
    });

    // 菜单是否折叠
    const isCollapse = computed(() => {
      return props.operateCollapseMin > 0 && validOperations.value.length >= props.operateCollapseMin;
    });

    const operationsQuery = computed(() => {
      const res: Partial<Record<TABLE_OPERATION, IOperation<any>>> = {};
      validOperations.value.length &&
        validOperations.value.forEach(item => {
          res[item.key] = item;
        });
      return res;
    });

    // 点击菜单
    function handleClickOperation({ key }: MenuInfo) {
      operationsQuery.value[key as TABLE_OPERATION]?.handler(props.bodyCell);
    }

    return () => {
      const noCollapseOperations = (
        <Space
          wrap
          class="table-operator"
        >
          {validOperations.value.map(opera => (
            <Button
              key={opera.key}
              {...opera.buttonProps}
              type={opera.buttonProps?.type || "link"}
              loading={unref(opera.buttonProps?.loading)}
              disabled={isFunction(opera?.disabled) ? opera.disabled(props.bodyCell) : opera.disabled}
              onClick={() => opera.handler(unref(props.bodyCell))}
              v-slots={{
                icon: () => opera.buttonProps?.icon,
              }}
            >
              {opera.value && (isFunction(opera.value) ? opera.value(props.bodyCell) : opera.value)}
            </Button>
          ))}
        </Space>
      );
      const collapsedOperations = (
        <Dropdown
          v-slots={{
            overlay: () => (
              <Menu
                onClick={handleClickOperation}
                class={"table-operator"}
              >
                {validOperations.value.map(opera => (
                  <Menu.Item
                    key={opera.key}
                    disabled={isFunction(opera?.disabled) ? opera.disabled(props.bodyCell) : opera.disabled}
                  >
                    <Button
                      {...opera.buttonProps}
                      type={opera.buttonProps?.type || "link"}
                      disabled={isFunction(opera?.disabled) ? opera.disabled(props.bodyCell) : opera.disabled}
                      v-slots={{
                        icon: () => opera.buttonProps?.icon,
                      }}
                    >
                      {opera.value && (isFunction(opera.value) ? opera.value(props.bodyCell) : opera.value)}
                    </Button>
                  </Menu.Item>
                ))}
              </Menu>
            ),
          }}
        >
          <EllipsisOutlined />
        </Dropdown>
      );
      return isCollapse.value ? collapsedOperations : noCollapseOperations;
    };
  },
});

export default ITableOperator;
