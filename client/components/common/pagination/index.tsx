import { Flex, FlexProps, Pagination } from "ant-design-vue";
import { paginationProps } from "ant-design-vue/es/pagination";
import { PropType, SlotsType, computed, defineComponent } from "vue";

import { omit, useNameSpace } from "@/util";
import "./index.less";

export const IPaginationProps = {
  ...paginationProps(),
  align: {
    type: String as PropType<FlexProps["justify"]>,
    default: "end",
  },
};

export const IPaginationSlots = Object as SlotsType<{
  prefix: () => any;
  suffix: () => any;
}>;

const cls = useNameSpace("pagination");

const IPagination = defineComponent({
  name: "IPagination",
  props: IPaginationProps,
  slots: IPaginationSlots,
  setup(props, { slots }) {
    const defaultProps = computed(() => omit(props));
    return () => (
      <Flex
        class={cls.b()}
        justify={props.align}
      >
        {slots.prefix?.()}
        <Pagination {...defaultProps.value} />
        {slots.suffix?.()}
      </Flex>
    );
  },
});

export default IPagination;
