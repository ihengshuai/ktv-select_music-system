import { createApp, h } from "vue";

import { setupI18n, setupAppWorker } from "@/helper";

import App from "./App";
import { appInterceptor } from "./helper/app-interceptor";
import AppProvider from "./layout/default/application";
import { setupRouter, setupRouterGuard } from "./router";
import { setupStore } from "./store";
import "@/style/index.less";
import "virtual:uno.css";

async function bootstrap() {
  const app = createApp(h(AppProvider, () => h(App)));

  await setupI18n(app);

  await setupStore(app);

  await appInterceptor();

  const router = await setupRouter(app);

  await setupRouterGuard(router);

  setupAppWorker();

  app.mount("#app");
}

try {
  bootstrap();
} catch (error) {
  console.log(error);
}
