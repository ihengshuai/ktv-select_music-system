import { Transition, defineComponent } from "vue";
import "./index.less";

export const TransitionPage = defineComponent({
  name: "TransitionPage",
  setup(props, { slots }) {
    return () => (
      <Transition
        mode="out-in"
        name="transition-page"
        appear
      >
        {slots.default?.()}
      </Transition>
    );
  },
});
