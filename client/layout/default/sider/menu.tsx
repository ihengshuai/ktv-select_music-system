import {
  AppstoreAddOutlined,
  FileSearchOutlined,
  MoneyCollectOutlined,
  ReadOutlined,
  SlidersOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons-vue";
import { Menu } from "ant-design-vue";
import { Key } from "ant-design-vue/es/_util/type";
import { MenuInfo } from "ant-design-vue/es/menu/src/interface";
import { PropType, computed, defineComponent, nextTick, ref, toRefs, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";

import { THEME_MODE, WINDOW_OPEN_TYPE } from "@/constants/common";
import { ROUTE_NAME } from "@/constants/route";
import { USER_ROLE } from "@/constants/user";
import { useAppStore, useUserStore } from "@/store";
import { IBreadcrumb, IMenuItem } from "@/typings/common/menu";
import { flatDeepArrayKeyToObject, useNameSpace } from "@/util";

const cls = useNameSpace("layout-sider");

const LayoutMenu = defineComponent({
  name: "LayoutMenu",
  props: {
    theme: {
      type: String as PropType<THEME_MODE>,
      default: THEME_MODE.DARK,
    },
  },
  setup(props) {
    const appStore = useAppStore();
    const { setBreadcrumb, setPageTitle, appendNavigateTags } = appStore;
    const { siderCollapsed } = toRefs(appStore);
    const route = useRoute();
    const router = useRouter();
    const selectedKeys = ref<Key[]>([]);
    const openKeys = ref<string[]>();
    const userStore = useUserStore();

    // 菜单
    const menus = ref<IMenuItem[]>([
      {
        key: ROUTE_NAME.dashboard,
        icon: () => <SlidersOutlined />,
        title: "menu.dashboard",
        children: [
          {
            key: ROUTE_NAME.dashboardMusic,
            title: "menu.dashboard-music",
          },
          {
            key: ROUTE_NAME.dashboardIncome,
            title: "menu.dashboard-income",
          },
        ],
      },
      {
        key: ROUTE_NAME.userManage,
        icon: () => <TeamOutlined />,
        title: "menu.user-manage",
        validator: () => [USER_ROLE.SUPER, USER_ROLE.ADMIN].includes(userStore.userState.user?.level!),
      },
      {
        key: ROUTE_NAME.staticManager,
        icon: () => <FileSearchOutlined />,
        title: "menu.static-manager",
        validator: () => [USER_ROLE.SUPER, USER_ROLE.ADMIN].includes(userStore.userState.user?.level!),
      },
      {
        key: ROUTE_NAME.enumCode,
        icon: () => <TagsOutlined />,
        title: "menu.enum-code",
        validator: () => [USER_ROLE.SUPER, USER_ROLE.ADMIN].includes(userStore.userState.user?.level!),
      },
      {
        key: ROUTE_NAME.music,
        icon: () => <AppstoreAddOutlined />,
        title: "menu.music-manager",
        validator: () => [USER_ROLE.SUPER, USER_ROLE.ADMIN].includes(userStore.userState.user?.level!),
        children: [
          {
            key: ROUTE_NAME.musicList,
            title: "menu.music-list",
          },
          {
            key: ROUTE_NAME.musicLyrics,
            title: "menu.music-lyrics",
          },
          {
            key: ROUTE_NAME.musicSinger,
            title: "menu.music-singer",
          },
          {
            key: ROUTE_NAME.musicStyle,
            title: "menu.music-style",
          },
          {
            key: ROUTE_NAME.musicTag,
            title: "menu.music-tag",
          },
          {
            key: ROUTE_NAME.musicRegion,
            title: "menu.music-region",
          },
          {
            key: ROUTE_NAME.musicLanguage,
            title: "menu.music-language",
          },
        ],
      },

      {
        key: ROUTE_NAME.order,
        icon: () => <MoneyCollectOutlined />,
        title: "menu.order",
        validator: () => [USER_ROLE.SUPER, USER_ROLE.ADMIN].includes(userStore.userState.user?.level!),
        children: [
          {
            key: ROUTE_NAME.orderList,
            title: "menu.order-list",
          },
          {
            key: ROUTE_NAME.orderPay,
            title: "menu.order-pay",
          },
        ],
      },

      {
        key: "ktv-docs",
        icon: () => <ReadOutlined />,
        title: "menu.readme",
        target: WINDOW_OPEN_TYPE.NEW_TAB,
        link: "https://blog.usword.cn/article/2019/ktv-system.html?from=vue3-admin",
      },
    ]);
    const menuMap = computed(() => flatDeepArrayKeyToObject(menus.value, "children") || {});

    const menuCls = computed(() => ({
      [cls.e("menu")]: true,
      fx1: true,
    }));

    watch(route, updateStateOnRouteChange, { immediate: true });

    // 侧边栏折叠时控制菜单展开
    watch(siderCollapsed, () => nextTick(() => triggerOpenChange(route.name as ROUTE_NAME)) as any);

    // 路由改变时更新状态
    function updateStateOnRouteChange(to: RouteLocationNormalizedLoaded) {
      const { name, meta = {} } = to;
      const { menu, pageTitle } = meta;
      triggerOpenChange(menu || (name as ROUTE_NAME));
      selectedKeys.value = [menu || (name as ROUTE_NAME)];

      const parentMenus = getParentMenus(name as ROUTE_NAME);
      const breadcrumbs: IBreadcrumb[] = parentMenus
        .map(
          item =>
            ({
              title: item.title!,
              name: item.key,
            } as IBreadcrumb)
        )
        .concat({ title: pageTitle!, name: name as ROUTE_NAME });

      setBreadcrumb(breadcrumbs);
      setPageTitle(pageTitle);
      appendNavigateTags({
        title: pageTitle,
        to: {
          name: name as ROUTE_NAME,
          params: to.params,
        },
      });
    }

    function getParentMenus(routeKey: ROUTE_NAME): Array<IMenuItem> {
      if (!routeKey) return [];
      const menuKeys = getParentKeys(routeKey);
      if (!menuKeys.length) return [];
      return menuKeys.map(menu => menuMap.value[menu]).filter(Boolean);
    }

    function onClickMenuItem({ key, item }: MenuInfo): void {
      try {
        const menu = item.originItemValue as IMenuItem;
        if (menu?.link) {
          window.open(menu.link, menu?.target || WINDOW_OPEN_TYPE.NEW_TAB);
          return;
        }
        if (menu?.target && menu?.target !== WINDOW_OPEN_TYPE.SELF_TAB) {
          try {
            const routeURL = router.resolve({ name: key as ROUTE_NAME, params: { ...route.params } }).fullPath;
            routeURL && window.open(routeURL, menu?.target || WINDOW_OPEN_TYPE.NEW_TAB);
            return;
          } catch (err) {}
        }
        router.push({
          name: key as ROUTE_NAME,
          params: { ...route.params },
        });
      } catch (error) {
        console.log(error);
      }
    }

    function triggerOpenChange(routeKey: ROUTE_NAME): void {
      openKeys.value = siderCollapsed.value ? [] : getParentKeys(routeKey);
    }

    function getParentKeys(routeKey: ROUTE_NAME): Array<ROUTE_NAME> {
      const menuKeys: Array<ROUTE_NAME> = [];
      let index;

      if (!routeKey) return menuKeys;

      while ((index = routeKey.lastIndexOf("-")) !== -1) {
        routeKey = routeKey.substring(0, index) as ROUTE_NAME;
        menuKeys.unshift(routeKey);
      }

      return menuKeys;
    }
    return () => (
      <Menu
        v-model:openKeys={openKeys.value}
        v-model:selectedKeys={selectedKeys.value}
        theme={props.theme}
        selectable={false}
        mode="inline"
        class={menuCls.value}
        onClick={onClickMenuItem}
      >
        {menus.value.map(
          menu =>
            ((menu.validator && menu.validator()) || menu.validator === undefined) && (
              <MenuSub
                key={menu.key}
                item={menu}
              />
            )
        )}
      </Menu>
    );
  },
});

export default LayoutMenu;

const MenuSub = defineComponent({
  name: "MenuSub",
  props: {
    item: {
      type: Object as PropType<IMenuItem>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { t } = useI18n();
    return () => (
      <>
        {props.item?.children ? (
          <Menu.SubMenu
            title={t(props.item.title!)}
            key={props.item?.key}
            icon={props.item.icon}
          >
            {props.item?.children?.map(
              menu =>
                (menu.validator && menu.validator()) ||
                (menu.validator === undefined && (
                  <MenuSub
                    key={menu.key}
                    item={menu}
                  />
                ))
            )}
          </Menu.SubMenu>
        ) : (
          <MenuItem
            key={props.item.key}
            item={props.item}
          />
        )}
      </>
    );
  },
});

const MenuItem = defineComponent({
  name: "MenuItem",
  props: {
    item: {
      type: Object as PropType<IMenuItem>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    // const route = useRoute();
    const { resolve } = useRouter();
    const menuLink = ref("#");

    watchEffect(() => {
      if (props.item.link) return (menuLink.value = props.item.link);
      try {
        // https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
        // resolve内部会做匹配,没有定义对应的params,会出现警告,不用管(这里先去掉params)
        menuLink.value = resolve({ name: props.item.key /** , params: { ...route.params } */ })?.fullPath || "/";
      } catch (err) {}
    });

    return () => (
      <Menu.Item
        key={props.item?.key}
        originItemValue={props.item}
        disabled={props.item.disabled}
      >
        <a
          href={menuLink.value}
          onClick={e => e.preventDefault()}
          target={props.item.target || WINDOW_OPEN_TYPE.SELF_TAB}
          style={"cursor: inherit"}
        >
          {props.item.icon?.()}
          <span>{t(props.item.title!)}</span>
        </a>
      </Menu.Item>
    );
  },
});
