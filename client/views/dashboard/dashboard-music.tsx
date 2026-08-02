import { defineComponent } from "vue";

import IPanel from "@/components/common/panel";

const WelcomePage = defineComponent({
  name: "WelcomePage",
  setup() {
    return () => (
      <IPanel withCard>
        <h2 class="text-30px p-v-10">KTV点歌系统V2</h2>
      </IPanel>
    );
  },
});

export default WelcomePage;
