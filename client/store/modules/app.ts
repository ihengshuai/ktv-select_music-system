import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { useConfig } from "@/config";
import { NAVIGATE_TAG_CLOSE_TYPE, PROJECT_LANGS, THEME_MODE } from "@/constants/common";
import { ROUTE_NAME } from "@/constants/route";
import { APP_LOCALE_EXPIRE, STORAGE_KEYS } from "@/constants/storage-keys";
import { IBreadcrumb, INavigateMenu } from "@/typings/common/menu";
import { getCookie, getLocalStorage, setCookie, setLocalStorage } from "@/util";

export const useAppStore = defineStore("app", () => {
  const { t } = useI18n();
  const isAppVersionChanged = ref(false);
  const router = useRouter();
  const route = useRoute();
  const breadcrumbs = ref<IBreadcrumb[]>([]);
  const showNavigateTag = ref(!getLocalStorage(STORAGE_KEYS.NAVIGATE_TAGS_VISIBLE_) ? true : false);
  const navigateMap = ref<Map<ROUTE_NAME, INavigateMenu>>(
    new Map([[ROUTE_NAME.adminHome, { title: "menu.home", closeable: false, to: { name: ROUTE_NAME.adminHome } }]])
  );
  const navigateTags = computed(() => [...navigateMap.value.values()]);
  const config = useConfig();
  const siderCollapsed = ref(getLocalStorage(STORAGE_KEYS.SIDER_COLLAPSED_) === "true" || false);
  const appMode = ref(getLocalStorage<THEME_MODE>(STORAGE_KEYS._APP_THEME_MODE_) || THEME_MODE.LIGHT);
  const isLightMode = computed(() => appMode.value === THEME_MODE.LIGHT);
  const appLocale = ref<PROJECT_LANGS>((getCookie(config.COOKIE_LANG_KEY) as PROJECT_LANGS) || config.DEFAULT_LANGUAGE);

  function toggleSiderCollapsed(collapsed?: boolean) {
    if (collapsed !== undefined) {
      siderCollapsed.value = collapsed;
    } else {
      siderCollapsed.value = !siderCollapsed.value;
    }
    setLocalStorage(STORAGE_KEYS.SIDER_COLLAPSED_, `${siderCollapsed.value}`);
  }

  function toggleAppMode(mode?: THEME_MODE) {
    if (mode !== undefined) {
      appMode.value = mode;
    } else {
      appMode.value = appMode.value === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    }
    setLocalStorage(STORAGE_KEYS._APP_THEME_MODE_, `${appMode.value}`);
  }

  function setAppLocale(locale: PROJECT_LANGS) {
    appLocale.value = locale;
    setCookie(config.COOKIE_LANG_KEY, locale, APP_LOCALE_EXPIRE);
  }

  function setBreadcrumb(breadcrumb: IBreadcrumb[] = []) {
    breadcrumbs.value = breadcrumb;
  }

  function setPageTitle(title?: string) {
    if (title) {
      document.title = t(title) + " - " + config.APP_TITLE;
    } else {
      document.title = config.APP_TITLE;
    }
  }

  function appendNavigateTags(navigate: INavigateMenu) {
    if (navigate.to.name === ROUTE_NAME.adminHome) return;
    if (navigateMap.value.has(navigate.to.name)) {
      navigateMap.value.set(navigate.to.name, navigate);
      return;
    }
    navigateMap.value.set(navigate.to.name, navigate);
  }

  /** 关闭导航标签 */
  function removeNavigateTags(type: NAVIGATE_TAG_CLOSE_TYPE, navigate?: INavigateMenu) {
    const { CLOSE_SELF, CLOSE_OTHER, CLOSE_ALL, CLOSE_LEFT, CLOSE_RIGHT } = NAVIGATE_TAG_CLOSE_TYPE;
    if (type === CLOSE_SELF) {
      navigate && navigateMap.value.delete(navigate.to.name);
      if (route.name !== navigate?.to.name) return;
      return router.push(navigateTags.value[navigateTags.value.length - 1].to);
    }
    if (type === CLOSE_OTHER) {
      navigateTags.value.forEach(item => {
        if (item.to.name !== route.name && item.to.name !== ROUTE_NAME.adminHome) {
          navigateMap.value.delete(item.to.name);
        }
      });
      return;
    }
    if (type === CLOSE_ALL) {
      navigateTags.value.forEach(item => {
        if (item.to.name !== ROUTE_NAME.adminHome) {
          navigateMap.value.delete(item.to.name);
        }
      });
      return router.push({ name: ROUTE_NAME.adminHome });
    }
    if (type === CLOSE_LEFT) {
      const needRemoveTags: ROUTE_NAME[] = [];
      for (let i = 0; i < navigateTags.value.length; i++) {
        const item = navigateTags.value[i];
        if (item.to.name !== ROUTE_NAME.adminHome && item.to.name !== route.name) {
          needRemoveTags.push(item.to.name);
        }
        if (item.to.name === route.name) {
          break;
        }
      }
      return needRemoveTags.forEach(name => navigateMap.value.delete(name));
    }
    if (type === CLOSE_RIGHT) {
      const needRemoveTags: ROUTE_NAME[] = [];
      for (let i = navigateTags.value.length - 1; i >= 0; i--) {
        const item = navigateTags.value[i];
        if (item.to.name !== ROUTE_NAME.adminHome && item.to.name !== route.name) {
          needRemoveTags.push(item.to.name);
        }
        if (item.to.name === route.name) {
          break;
        }
      }
      return needRemoveTags.forEach(name => navigateMap.value.delete(name));
    }
  }

  function toggleNavigateTagVisible() {
    showNavigateTag.value = !showNavigateTag.value;
    if (showNavigateTag.value) {
      localStorage.removeItem(STORAGE_KEYS.NAVIGATE_TAGS_VISIBLE_);
    } else {
      setLocalStorage(STORAGE_KEYS.NAVIGATE_TAGS_VISIBLE_, false);
    }
  }

  return {
    isAppVersionChanged,
    appLocale,
    siderCollapsed,
    appMode,
    isLightMode,
    breadcrumbs,
    navigateTags,
    showNavigateTag,
    setAppLocale,
    toggleAppMode,
    toggleSiderCollapsed,
    setBreadcrumb,
    setPageTitle,
    appendNavigateTags,
    removeNavigateTags,
    toggleNavigateTagVisible,
  };
});
