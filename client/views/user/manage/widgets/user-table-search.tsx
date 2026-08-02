import { Button, Form, FormItem, Input, Select, Space } from "ant-design-vue";
import { defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

import { USER_ROLE, USER_STATUS } from "@/constants/user";
import { getEnumOptions } from "@/helper";
import { ITableFilter } from "@/typings/common/table";
import { IUserListFilter } from "@/typings/models/user";

const UserTableSearch = defineComponent({
  name: "UserTableSearch",
  props: {
    filters: {
      type: Object as PropType<ITableFilter<IUserListFilter>>,
      required: true,
    },
  },
  emits: ["search", "reset"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const levelOpts = getEnumOptions(USER_ROLE).map(l => ({ ...l, value: `${l.value}` }));
    const statusOpts = getEnumOptions(USER_STATUS).map(l => ({ ...l, value: `${l.value}` }));

    function onSearch() {
      emit("search");
    }

    return () => (
      <Form class="table-form">
        <Space
          wrap
          class="py-4"
        >
          <FormItem
            label="角色"
            name="level"
          >
            <Select
              v-model:value={props.filters.level!.value}
              options={levelOpts}
              allowClear
              placeholder="请选择"
              class="w-120"
            />
          </FormItem>

          <FormItem
            label="状态"
            name="status"
          >
            <Select
              v-model:value={props.filters.status!.value}
              options={statusOpts}
              allowClear
              placeholder="请选择"
              class="w-120"
            />
          </FormItem>

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

export default UserTableSearch;
