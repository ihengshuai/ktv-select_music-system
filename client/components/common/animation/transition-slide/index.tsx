import { PropType, Transition, computed, defineComponent } from "vue";

import { DIRECTION } from "@/constants/common";
import "./index.less";

export const TransitionSlide = defineComponent({
  name: "TransitionSlide",
  props: {
    direction: {
      type: String as PropType<DIRECTION>,
      default: DIRECTION.TOP,
    },
  },
  setup(props, { slots }) {
    const transitionName = computed(() => `tansition-slide-${props.direction}`);
    return () => (
      <Transition
        mode="out-in"
        name={transitionName.value}
      >
        {slots.default?.()}
      </Transition>
    );
  },
});
