import { Card, Layout, Space } from "ant-design-vue";
import { cardProps } from "ant-design-vue/es/card/Card";
import { computed, defineComponent } from "vue";

import { omit, useNameSpace } from "@/util";
import "./index.less";

export const IPanelProps = {
  ...cardProps(),
  withCard: {
    type: Boolean,
    default: true,
  },
  withMargin: {
    type: Boolean,
    default: true,
  },
};

const cls = useNameSpace("layout-panel");

const IPanel = defineComponent({
  name: "IPanel",
  props: IPanelProps,
  setup(props, { attrs, slots }) {
    const cardProps = computed(() => {
      const res = omit(props, "extra");
      return res;
    });
    const wrapCls = computed(() => ({
      [cls.b()]: true,
      "with-margin": props.withMargin,
    }));
    return () => {
      const extra = props.extra || slots.extra?.();
      return (
        <Layout class={wrapCls.value}>
          {props.withCard ? (
            <Card
              {...cardProps.value}
              {...attrs}
            >
              {{
                extra: extra && (() => <Space size={8}>{extra}</Space>),
                default: slots.default,
              }}
            </Card>
          ) : (
            slots.default?.()
          )}
        </Layout>
      );
    };
  },
});

export default IPanel;
