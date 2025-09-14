import { SettingOutlined } from "@ant-design/icons-vue";
import { defineComponent } from "vue";

import { useNameSpace } from "@/util";

const cls = useNameSpace("table-header__toolbar__item");

const ITableHeaderSettingTool = defineComponent({
  name: "ITableHeaderSettingTool",
  setup() {
    return () => (
      <span class={cls.b()}>
        <SettingOutlined />
      </span>
    );
  },
});

export default ITableHeaderSettingTool;
