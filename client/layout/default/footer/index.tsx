import { CopyrightCircleOutlined, GithubFilled, WeiboCircleFilled } from "@ant-design/icons-vue";
import { Layout, Space } from "ant-design-vue";
import { defineComponent } from "vue";

import { useNameSpace } from "@/util";

const cls = useNameSpace("layout-footer");

const LayoutFooter = defineComponent({
  name: "LayoutFooter",
  setup() {
    const now = new Date().getFullYear();

    return () => (
      <Layout.Footer class={cls.b()}>
        <Space class={cls.e("item")}>
          <CopyrightCircleOutlined />
          <a
            href="https://github.com/ihengshuai"
            target="_blank"
            class="author"
          >
            ihengshuai
          </a>
          2019 - {now}
        </Space>
        <Space class={cls.e("item")}>
          <a
            href="https://github.com/ihengshuai"
            target="_blank"
            class="link"
          >
            <GithubFilled />
          </a>
          <a
            href="https://blog.usword.cn"
            target="_blank"
            class="link"
          >
            <WeiboCircleFilled />
          </a>
        </Space>
      </Layout.Footer>
    );
  },
});

export default LayoutFooter;
