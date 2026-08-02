import { Button, Form, Input, Space } from "ant-design-vue";
import { defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

import { ITableFilter } from "@/typings/common/table";
import { IQueryMusicLanguageDTO } from "@/typings/models/music/music-language";

const LanguageSearch = defineComponent({
  name: "LanguageSearch",
  props: {
    filters: {
      type: Object as PropType<ITableFilter<IQueryMusicLanguageDTO>>,
      required: true,
    },
  },
  emits: ["search", "reset"],
  setup(props, { emit }) {
    const { t } = useI18n();

    return () => (
      <Form class="table-form">
        <Space
          wrap
          class="py-4"
        >
          <Form.Item>
            <Input
              v-model:value={props.filters.keywords!.value}
              allowClear
              class="w-200"
              placeholder={t("common.keywords")}
              onPressEnter={() => emit("search")}
            />
          </Form.Item>

          <Button
            type="link"
            size="small"
            onClick={() => emit("search")}
          >
            搜索
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => emit("reset")}
          >
            重置
          </Button>
        </Space>
      </Form>
    );
  },
});

export default LanguageSearch;
