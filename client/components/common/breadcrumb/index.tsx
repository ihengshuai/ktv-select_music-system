import { Breadcrumb, BreadcrumbItem } from "ant-design-vue";
import { PropType, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { IBreadcrumb } from "@/typings/common/menu";
import { useNameSpace } from "@/util";

const ns = useNameSpace("breadcrumb");
const wrapCls = ns.b();

const IBreadcrumbComp = defineComponent({
  name: "IBreadcrumbComp",
  props: {
    items: {
      type: Array as PropType<IBreadcrumb[]>,
      default: () => [],
    },
  },
  setup(props, { attrs }) {
    const router = useRouter();
    const { t } = useI18n();

    const handleClickBreadcrumb = (e: Event, breadcrumb: IBreadcrumb) => {
      e.preventDefault();
      router.push({ name: breadcrumb.name });
    };

    return () => (
      <Breadcrumb
        class={wrapCls}
        {...attrs}
      >
        {props.items.map((item, idx) => (
          <BreadcrumbItem key={item.name}>
            {idx < props.items.length - 1 ? (
              <a
                href={router.resolve({ name: item.name }).fullPath || "#"}
                onClick={e => handleClickBreadcrumb(e, item)}
              >
                {item.title && t(item.title)}
              </a>
            ) : (
              item.title && t(item.title)
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    );
  },
});

export default IBreadcrumbComp;
