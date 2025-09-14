import { ColumnHeightOutlined } from "@ant-design/icons-vue";
import { Dropdown, Menu, TableProps, Tooltip } from "ant-design-vue";
import { PropType, defineComponent } from "vue";

import { useNameSpace } from "@/util";

const cls = useNameSpace("table-header__toolbar__item");
const menuCls = cls.e("menu");

export const ITableHeaderSizeToolProps = {
  size: {
    type: String as PropType<TableProps["size"]>,
    default: "middle",
  },
  onChange: {
    type: Function as PropType<(size: TableProps["size"]) => void>,
    default: null,
  },
};

const ITableHeaderSizeTool = defineComponent({
  name: "ITableHeaderSizeTool",
  props: ITableHeaderSizeToolProps,
  setup(props) {
    const sizeOpts = [
      {
        label: "紧凑",
        value: "small",
      },
      {
        label: "默认",
        value: "middle",
      },
      {
        label: "宽松",
        value: "large",
      },
    ];
    const clickSizeMenuItem = (val: TableProps["size"]) => {
      props.onChange?.(val);
    };
    return () => (
      <Tooltip title={"表格密度调整"}>
        <Dropdown
          trigger={"click"}
          placement="bottom"
          overlay={
            <Menu
              class={menuCls}
              selectedKeys={[props.size!]}
              onClick={({ key }) => clickSizeMenuItem(key as TableProps["size"])}
            >
              {sizeOpts.map((item, idx) => (
                <>
                  {idx > 0 && <Menu.Divider />}
                  <Menu.Item key={item.value}>{item.label}</Menu.Item>
                </>
              ))}
            </Menu>
          }
        >
          <span class={cls.b()}>
            <ColumnHeightOutlined />
          </span>
        </Dropdown>
      </Tooltip>
    );
  },
});

export default ITableHeaderSizeTool;
