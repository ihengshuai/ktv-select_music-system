import { Button, Form, FormItem, Input, Space } from "ant-design-vue";
import { defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

import { ITableFilter } from "@/typings/common/table";
import { IQueryEnumCodeDTO } from "@/typings/models/enum-code/enum-code";

const EnumCodeSearch = defineComponent({
  name: "EnumCodeSearch",
  props: {
    filters: {
      type: Object as PropType<ITableFilter<IQueryEnumCodeDTO>>,
      required: true,
    },
  },
  emits: ["search", "reset"],
  setup(props, { emit }) {
    const { t } = useI18n();

    function onSearch() {
      emit("search");
    }

    return () => (
      <Form class="table-form">
        <Space
          wrap
          class="py-4"
        >
          <FormItem name="keywords">
            <Input
              v-model:value={props.filters.keywords!.value}
              allowClear
              placeholder={t("common.keywords")}
              class="w-200"
              onPressEnter={onSearch}
            />
          </FormItem>

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

export default EnumCodeSearch;
