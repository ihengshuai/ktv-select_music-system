import { CloseOutlined, DownOutlined } from "@ant-design/icons-vue";
import { EnumUtils } from "@hengshuai/helper";
import { Dropdown, Flex, Menu } from "ant-design-vue";
import { ComponentPublicInstance, computed, defineComponent, nextTick, onMounted, ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { NAVIGATE_TAG_CLOSE_TYPE } from "@/constants/common";
import { ROUTE_NAME } from "@/constants/route";
import { useAppStore } from "@/store";
import { INavigateMenu } from "@/typings/common/menu";
import { useNameSpace } from "@/util";

const ns = useNameSpace("history-tag");
const wrapCls = ns.b();
const tagCls = ns.e("tags");
const tagItemCls = ns.em("tags", "item");
const actionCls = ns.e("actions");
const closeCls = ns.em("tags", "close");

const IHistoryTag = defineComponent({
  name: "IHistoryTag",
  setup(props, { attrs }) {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const appStore = useAppStore();
    const { removeNavigateTags } = appStore;
    const { navigateTags } = toRefs(appStore);
    const tagsRef = ref<ComponentPublicInstance>();

    const closeTagTypeOpts = computed(() =>
      EnumUtils.getEntries(NAVIGATE_TAG_CLOSE_TYPE)
        .filter(item => item.alias)
        .map(item => ({
          value: item.value,
          key: item.alias,
          disabled: getCloseTypeDisabled(item.value as NAVIGATE_TAG_CLOSE_TYPE),
        }))
    );

    const handleCloseTag = (e: MouseEvent | null, type: NAVIGATE_TAG_CLOSE_TYPE, tag?: INavigateMenu) => {
      e?.stopPropagation();
      removeNavigateTags(type, tag);
    };

    watch(route, updateActiveTagPos, { flush: "post" });

    onMounted(updateActiveTagPos);

    function getCloseTypeDisabled(type: NAVIGATE_TAG_CLOSE_TYPE) {
      if (type === NAVIGATE_TAG_CLOSE_TYPE.CLOSE_ALL) return navigateTags?.value?.length <= 1;
      if (type === NAVIGATE_TAG_CLOSE_TYPE.CLOSE_OTHER) return navigateTags?.value?.length <= 2;
      if (type === NAVIGATE_TAG_CLOSE_TYPE.CLOSE_LEFT) {
        const removed = [];
        for (let i = 0; i < navigateTags?.value?.length; i++) {
          if (navigateTags.value[i].to.name === route.name) break;
          if (navigateTags.value[i].to.name !== ROUTE_NAME.welcome) {
            removed.push(navigateTags.value[i]);
          }
        }
        return removed.length < 1;
      }
      if (type === NAVIGATE_TAG_CLOSE_TYPE.CLOSE_RIGHT) {
        const removed = [];
        for (let i = navigateTags.value.length - 1; i >= 0; i--) {
          if (navigateTags.value[i].to.name === route.name) break;
          if (navigateTags.value[i].to.name !== ROUTE_NAME.welcome) {
            removed.push(navigateTags.value[i]);
          }
        }
        return removed.length < 1;
      }
    }

    function updateActiveTagPos() {
      if (!window || !tagsRef?.value?.$el) return;
      nextTick(() => {
        const tagsWrapElem = tagsRef.value!.$el as HTMLElement;
        const activeElem: HTMLElement = tagsWrapElem.querySelector(`.${tagItemCls}.active`)!;
        const halfWrapWidth = tagsWrapElem.getBoundingClientRect().width / 2;
        tagsWrapElem.scroll({
          left: activeElem.offsetLeft - halfWrapWidth + 0.5 * activeElem.offsetWidth,
          behavior: "smooth",
        });
      });
    }

    return () => (
      <Flex
        class={wrapCls}
        {...attrs}
      >
        <Flex
          ref={tagsRef}
          flex={1}
          class={tagCls}
          align="end"
          gap={6}
        >
          {navigateTags.value.map(item => (
            <span
              key={item.to.name}
              class={`${tagItemCls} ${item.to.name === route.name ? "active" : ""}`}
              onClick={() => router.push(item.to)}
            >
              {item.title && t(item.title)}
              {item.closeable !== false && (
                <CloseOutlined
                  class={closeCls}
                  onClick={e => handleCloseTag(e, NAVIGATE_TAG_CLOSE_TYPE.CLOSE_SELF, item)}
                />
              )}
            </span>
          ))}
        </Flex>
        <Flex class={actionCls}>
          <Dropdown
            trigger={"click"}
            overlay={
              <Menu onClick={({ key }) => handleCloseTag(null, key as NAVIGATE_TAG_CLOSE_TYPE)}>
                {closeTagTypeOpts.value.map((item, idx) => (
                  <>
                    <Menu.Item
                      key={item.value}
                      disabled={item.disabled}
                    >
                      {t(item.key)}
                    </Menu.Item>
                    {idx === 1 ? <Menu.Divider /> : null}
                  </>
                ))}
              </Menu>
            }
          >
            <DownOutlined />
          </Dropdown>
        </Flex>
      </Flex>
    );
  },
});

export default IHistoryTag;
