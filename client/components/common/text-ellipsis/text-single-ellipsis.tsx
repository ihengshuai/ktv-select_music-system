import { Tooltip } from "ant-design-vue";
import { defineComponent } from "vue";
import "./style.less";

const TextSingleEllipsis = defineComponent({
  name: "TextSingleEllipsis",
  props: {
    text: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "",
    },
    tooltip: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    return () => {
      const content = (
        <span
          class="text-single-ellipsis"
          style={{ width: props.width }}
        >
          {props.text}
        </span>
      );
      return props.text && (props.tooltip ? <Tooltip title={props.text}>{content}</Tooltip> : content);
    };
  },
});

export default TextSingleEllipsis;
