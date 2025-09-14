import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

import IPanel from "@/components/common/panel";

const Dashboard = defineComponent({
  setup() {
    const { t } = useI18n();
    return () => (
      <>
        <h1>数据面板...</h1>
        <IPanel withCard>{t("menu.dashboard")}</IPanel>
      </>
    );
  },
});

export default Dashboard;
