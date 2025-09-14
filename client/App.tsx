import { ConfigProvider } from "ant-design-vue";
import enUS from "ant-design-vue/locale/en_US";
import zhCN from "ant-design-vue/locale/zh_CN";
import * as dayjs from "dayjs";
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";

import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import { PROJECT_LANGS } from "@/constants/common";

import { useAppContext } from "./layout/default/application";
import { darkTheme, lightTheme } from "./style/theme";

const App = defineComponent({
  setup() {
    const { locale } = useI18n();
    const appContext = useAppContext();

    const languagePackage = computed(() => {
      let lang;
      switch (locale.value) {
        case PROJECT_LANGS.ZH_CN:
          lang = zhCN;
          dayjs.locale("zh-cn");
          break;
        default:
          lang = enUS;
          dayjs.locale("en-us");
          break;
      }
      return lang;
    });

    const theme = computed(() => (appContext.isLightMode ? lightTheme : darkTheme));

    return () => (
      <ConfigProvider
        locale={languagePackage.value}
        theme={theme.value}
      >
        <router-view />
      </ConfigProvider>
    );
  },
});

export default App;
