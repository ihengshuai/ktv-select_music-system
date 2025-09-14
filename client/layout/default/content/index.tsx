import { Layout } from "ant-design-vue";
import { Transition, defineComponent } from "vue";
import { RouteLocationNormalizedLoaded, RouterView } from "vue-router";

import { useNameSpace } from "@/util";

import LayoutFooter from "../footer";

import "@/components/common/animation/transition-page/index.less";

const cls = useNameSpace("layout-content");

const LayoutContent = defineComponent({
  name: "Content",
  setup() {
    return () => (
      <Layout.Content class={cls.b()}>
        <RouterView
          v-slots={{
            default: ({ Component, route }: { Component: any; route: RouteLocationNormalizedLoaded }) => (
              <Transition
                name="transition-page"
                mode="out-in"
              >
                <div key={route.name!}>
                  {/* TODO: 路由缓存 */}
                  {/* <KeepAlive include={"RichTablePage"}>{() => ({ key: route.name!, ...Component })}</KeepAlive> */}
                  {Component}
                  <LayoutFooter />
                </div>
              </Transition>
            ),
          }}
        />
      </Layout.Content>
    );
  },
});

export default LayoutContent;
