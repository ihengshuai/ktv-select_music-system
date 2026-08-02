import { defineComponent } from "vue";

import IPanel from "@/components/common/panel";

const HomePage = defineComponent({
  setup() {
    return () => (
      <>
        <IPanel>欢迎回来...</IPanel>
      </>
    );
  },
});

export default HomePage;
