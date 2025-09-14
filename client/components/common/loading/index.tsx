import { defineComponent } from "vue";
import "./index.less";

export const CustomLoading = defineComponent({
  render() {
    const defaultSlot = this.$slots.default?.();
    return (
      <div class={"custom-loading"}>
        <div class={"loader"} />
        {defaultSlot && <span class="notice">{defaultSlot}</span>}
      </div>
    );
  },
});
