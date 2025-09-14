import { defineComponent } from "vue";

import IPanel from "@/components/common/panel";

const TablePageReadme = defineComponent({
  name: "TablePageReadme",
  setup() {
    return () => (
      <IPanel withCard>
        <h2>注意事项📢</h2>
        <p>
          由于antd的table组件已经足够灵活，所以项目对于table的ui没有过渡封装，只是简单的做了功能小调整，如使用声明式编程代替命令式编程
        </p>
        <h4>整体的使用遵循以下规则：</h4>
        <ul>
          <li>UI与数据分离，方便维护</li>
          <li>官方api保持一致，避免重复轮子负担</li>
          <li>部分特殊功能是新增的，相关api语义明确，开发者一看明了</li>
          <li>推荐使用useTablePage通用的hooks，功能强大，简单易懂</li>
        </ul>

        <h4>新增的功能(简单易用)：</h4>
        <ul>
          <li>表格toolbar</li>
          <li>表格排序</li>
          <li>url映射表格参数(page、size、sort、filter、form参数等等)</li>
          <li>url参数校验及转换</li>
          <li>自定义操作列</li>
          <li>表单过滤</li>
          <li>出错重试</li>
          <li>其他官方的功能...</li>
        </ul>
      </IPanel>
    );
  },
});

export default TablePageReadme;
