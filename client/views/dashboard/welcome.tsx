import { defineComponent } from "vue";

import IPanel from "@/components/common/panel";

const WelcomePage = defineComponent({
  name: "WelcomePage",
  setup() {
    return () => (
      <IPanel withCard>
        <h2 class="text-30px p-v-10">基于Vue3、NestJS、Antd4的后台管理系统</h2>
        <p>本系统页面模板比较少，是个纯净的后台系统，旨在帮助开发者定制统一的规则，做到开箱即用，无缝适配</p>
        <h3>功能介绍</h3>
        <ul>
          <li>深浅主题</li>
          <li>多语言适配</li>
          <li>优雅的表格封装</li>
          <li>优雅的表单封装</li>
          <li>优雅图表使用</li>
          <li>权限控制</li>
          <li>面包屑</li>
          <li>NodeJS介入BFF层</li>
          <li>优雅mock</li>
          <li>优雅日志</li>
          <li>等等...</li>
        </ul>
        <h3>相关项目</h3>
        <ul>
          <li>
            <a
              href="https://vue2-admin.usword.cn"
              target="_blank"
            >
              Vue2 + TS + Antd(此项目的vue2版本) 🔗
            </a>
          </li>
          <li>
            <a
              href="https://vue3-admin.usword.cn"
              target="_blank"
            >
              Vue3 + TS + Antd4 🔗
            </a>
          </li>
          <li>
            <a
              href="https://github.com/ihengshuai/vue3-admin-skeleton/tree/template_nest"
              target="_blank"
            >
              Vue3 + TS + NestJS + Antd4(BFF架构) 🔗
            </a>
          </li>
          <li>
            <a
              href="https://react-hooks-admin.usword.cn"
              target="_blank"
            >
              React Hooks + Redux + Ant Design5 🔗
            </a>
          </li>
          <li>
            <a
              href="https://react-hooks-admin.usword.cn"
              target="_blank"
            >
              React Hooks + Mobx + Ant Design5 🔗
            </a>
          </li>
        </ul>
      </IPanel>
    );
  },
});

export default WelcomePage;
