import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

const Chart = defineComponent({
  setup() {
    const { t } = useI18n();
    return () => <div>{t("menu.chart")}</div>;
  },
});

export default Chart;
