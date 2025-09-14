import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { Flex, Space, Tooltip } from "ant-design-vue";
import { defineComponent } from "vue";

import { pick, useNameSpace } from "@/util";

import "./index.less";

import ITableHeaderSettingTool from "./setting-tool";
import ITableHeaderSizeTool, { ITableHeaderSizeToolProps } from "./size-tool";

const cls = useNameSpace("table-header");
const wrapCls = cls.b();
const toolbarCls = cls.e("toolbar");
const titleCls = cls.e("title");

export const ITableHeaderProps = {
  defaultTool: {
    type: Boolean,
    default: true,
  },
};

const ITableHeader = defineComponent({
  name: "ITableHeader",
  props: {
    ...ITableHeaderProps,
    ...pick(ITableHeaderSizeToolProps, "size"),
    onSizeChange: pick(ITableHeaderSizeToolProps, "onChange").onChange,
  },
  setup(props, { slots }) {
    return () => {
      const title = slots.title?.();
      const titleTip = slots.titleTip?.();

      return (
        <Flex
          align="center"
          justify="space-between"
          class={wrapCls}
        >
          {title && (
            <Flex
              align="center"
              class={titleCls}
            >
              {title}
              {titleTip && (
                <Tooltip
                  title={titleTip}
                  placement="right"
                >
                  <InfoCircleOutlined class={"tip-icon"} />
                </Tooltip>
              )}
            </Flex>
          )}
          <Flex
            flex={1}
            justify="end"
            class={toolbarCls}
          >
            <Space
              align="center"
              wrap
            >
              {slots.toolbar?.()}
              {props.defaultTool && (
                <>
                  <ITableHeaderSizeTool
                    onChange={props.onSizeChange}
                    size={props.size}
                  />
                  <ITableHeaderSettingTool />
                </>
              )}
            </Space>
          </Flex>
        </Flex>
      );
    };
  },
});

export default ITableHeader;
