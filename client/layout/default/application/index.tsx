import { EnumUtils } from "@hengshuai/helper";
import { theme } from "ant-design-vue";
import { Ref, computed, defineComponent, onMounted, reactive, toRefs, watch } from "vue";

import { useConfig } from "@/config";
import { PROJECT_LANGS, THEME_MODE } from "@/constants/common";
import { createContext, useContext } from "@/hooks";
import { useAppStore } from "@/store";
import { setThemeVar } from "@/style/theme";
import { IAppLanguage } from "@/typings/common/common";
import { IBreadcrumb } from "@/typings/common/menu";

interface IAppContext {
  appMode: Ref<THEME_MODE>;
  isLightMode: Ref<boolean>;
  appLocale: Ref<PROJECT_LANGS>;
  appLanguages: IAppLanguage[];
  breadcrumbs: Ref<IBreadcrumb[]>;
  showNavigateTag: Ref<boolean>;
  toggleAppMode: (mode?: THEME_MODE) => void;
  setAppLocale: (locale: PROJECT_LANGS) => void;
}

const provideKey = Symbol();

const AppProvider = defineComponent({
  name: "AppProvider",
  setup(props, { slots }) {
    const config = useConfig();
    const appStore = useAppStore();
    const { toggleAppMode, setAppLocale } = appStore;
    const { appMode, appLocale, isLightMode, breadcrumbs, showNavigateTag } = toRefs(appStore);
    const { useToken } = theme;
    const { token } = useToken();

    const appLanguages = computed<IAppLanguage[]>(() => {
      const supportLanguages = config.LANGUAGES;
      const _appLanguages = supportLanguages.map(lang => {
        const entry = EnumUtils.getEntry(lang as any, PROJECT_LANGS);
        return {
          name: entry.alias,
          value: entry.value,
        } as IAppLanguage;
      });

      return _appLanguages;
    });

    const appConfig = reactive<IAppContext>({
      appMode,
      appLocale,
      appLanguages: appLanguages.value,
      isLightMode,
      breadcrumbs,
      showNavigateTag,
      toggleAppMode,
      setAppLocale,
    });
    createAppContext(appConfig as any);

    let styleElem: HTMLElement | null = null;
    watch(
      appMode,
      () => {
        if (!window) return;
        setThemeVars();
      },
      { immediate: true, flush: "post" }
    );

    onMounted(setThemeVars);

    function setThemeVars() {
      document.documentElement.setAttribute("data-theme", appMode.value);
      if (styleElem) styleElem.remove();
      const style = document.createElement("style");
      styleElem = style;
      style.innerHTML = setThemeVar(token.value);
      document.body.append(style);
    }

    return () => slots.default?.();
  },
});

export default AppProvider;

export function createAppContext(context: IAppContext) {
  createContext<IAppContext>(context, provideKey);
}

export function useAppContext() {
  return useContext<IAppContext>(provideKey);
}
