import { Layout, Modal, Watermark, theme } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { defineComponent, watch } from "vue";

import { useAppStore } from "@/store";
import { useNameSpace } from "@/util";

import LayoutContent from "./content";
import LayoutHeader from "./header";
import LayoutSider from "./sider";

import "./index.less";

const cls = useNameSpace("layout-wrap");

const _Layout = defineComponent({
  name: "Layout",
  setup() {
    const { useToken } = theme;
    const { token } = useToken();
    const appStore = useAppStore();
    const { isAppVersionChanged } = storeToRefs(appStore);

    watch(isAppVersionChanged, changed => {
      if (changed) {
        Modal.info({
          title: "温馨提示",
          content: "检测到新版本，请点击更新!",
          okText: "立即更新",
          onOk() {
            location.reload();
          },
        });
      }
    });

    return () => (
      <Watermark content={"赋码空间"}>
        <Layout
          hasSider
          class={cls.b()}
          style={{ background: token.value.colorBgBase }}
        >
          <LayoutSider />
          <Layout>
            <LayoutHeader />
            <LayoutContent />
            {/* <LayoutFooter /> */}
          </Layout>
        </Layout>
      </Watermark>
    );
  },
});

export default _Layout;
