import { Button, Form, Input, Select, Space } from "ant-design-vue";
import { defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

import { FILE_LOCATION, FILE_TYPE } from "@/constants/file";
import { getEnumOptions } from "@/helper";
import { ITableFilter } from "@/typings/common/table";
import { IStaticQueryDTO } from "@/typings/models/static/static";

const StaticTableSearch = defineComponent({
  name: "StaticTableSearch",
  props: {
    filters: {
      type: Object as PropType<ITableFilter<IStaticQueryDTO>>,
      default: () => ({}),
    },
  },
  emits: ["search", "reset"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const fileLocationOpts = getEnumOptions(FILE_LOCATION);
    const fileTypeOpts = getEnumOptions(FILE_TYPE);

    return () => (
      <Form class="table-form">
        <Space
          wrap
          class="py-3"
        >
          <Form.Item label="存储位置">
            <Select
              v-model:value={props.filters.location!.value}
              placeholder="请选择"
              options={fileLocationOpts}
              allowClear
              class="w-120"
            />
          </Form.Item>

          <Form.Item label="文件类型">
            <Select
              v-model:value={props.filters.type!.value}
              options={fileTypeOpts}
              placeholder="请选择"
              allowClear
              class="w-120"
            />
          </Form.Item>

          <Form.Item label="关键词">
            <Input
              allowClear
              v-model:value={props.filters.keywords!.value}
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

export default StaticTableSearch;
