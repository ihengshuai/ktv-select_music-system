import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from "@ant-design/icons-vue";
import { Layout } from "ant-design-vue";
import { computed, defineComponent, ref, toRefs } from "vue";

import { useConfig } from "@/config";
import { useAppStore } from "@/store";
import { useNameSpace } from "@/util";

import LayoutMenu from "./menu";
import SettingDrawer from "./setting";

const cls = useNameSpace("layout-sider");
const { APP_TITLE } = useConfig();

const Sider = defineComponent({
  setup() {
    const appStore = useAppStore();
    const { siderCollapsed, appMode } = toRefs(appStore);
    const { toggleSiderCollapsed } = appStore;
    const settingDrawerVisible = ref(false);

    const wrapCls = computed(() => ({
      [cls.b()]: true,
      collapsed: siderCollapsed.value,
    }));
    const footerCls = computed(() => ({
      [cls.e("footer")]: true,
      fx: true,
    }));

    return () => (
      <Layout.Sider
        collapsed={siderCollapsed.value}
        collapsible
        theme={appMode.value}
        trigger={null}
        class={wrapCls.value}
      >
        {/* logo */}
        <a
          href="/"
          class={`${cls.e("logo")} fx fx-jc fx-ac`}
        >
          <img src="/logo.png" />
          <span class="title">{APP_TITLE}</span>
        </a>

        {/* 菜单 */}
        <LayoutMenu theme={appMode.value} />

        {/* 脚部 */}
        <div class={footerCls.value}>
          {siderCollapsed.value ? (
            <MenuUnfoldOutlined onClick={() => toggleSiderCollapsed()} />
          ) : (
            <MenuFoldOutlined onClick={() => toggleSiderCollapsed()} />
          )}
          {siderCollapsed.value ? null : (
            <SettingOutlined onClick={() => (settingDrawerVisible.value = !settingDrawerVisible.value)} />
          )}
        </div>

        <SettingDrawer v-model:visible={settingDrawerVisible.value} />
      </Layout.Sider>
    );
  },
});

export default Sider;
