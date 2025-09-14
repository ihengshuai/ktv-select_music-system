import { CloseOutlined } from "@ant-design/icons-vue";
import { Drawer, Flex, List, Switch } from "ant-design-vue";
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

import { IconMoon, IconSun } from "@/components/common/icon";
import { useAppStore } from "@/store";
import { useNameSpace } from "@/util";

const ns = useNameSpace("layout-settings");

const SettingDrawer = defineComponent({
  name: "SettingDrawer",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const appStore = useAppStore();
    const theme = ref(true);
    return () => (
      <Drawer
        open={props.visible}
        title={t("menu.settings")}
        placement="left"
        closable={false}
        maskClosable
        extra={<CloseOutlined onClick={() => emit("update:visible", false)} />}
        onClose={() => emit("update:visible", false)}
      >
        <List
          dataSource={["1", "2"]}
          split
          grid={{ column: 2 }}
          class={ns.b()}
        >
          <List.Item>
            <Flex justify="space-between">
              <span>主题模式</span>
              <Switch
                v-model:checked={theme.value}
                onChange={() => appStore.toggleAppMode()}
                checked-children={<IconSun />}
                un-checked-children={<IconMoon />}
                class={ns.e("theme")}
              />
            </Flex>
          </List.Item>
          <List.Item>
            <Flex justify="space-between">
              <span>侧边栏折叠</span>
              <Switch
                checked={appStore.siderCollapsed}
                onChange={bool => appStore.toggleSiderCollapsed(bool as boolean)}
                checked-children={"开"}
                un-checked-children={"关"}
              />
            </Flex>
          </List.Item>
          <List.Item>
            <Flex justify="space-between">
              <span>显示导航标签</span>
              <Switch
                checked={appStore.showNavigateTag}
                onChange={() => appStore.toggleNavigateTagVisible()}
                checked-children={"开"}
                un-checked-children={"关"}
              />
            </Flex>
          </List.Item>
          <List.Item>其它...</List.Item>
        </List>
      </Drawer>
    );
  },
});

export default SettingDrawer;
