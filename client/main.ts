import { createApp, h } from "vue";

import App from "./App";
import { setupI18n, setupAppWorker, appInterceptor } from "./helper";
import { Exception } from "./helper/exception";
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

  app.config.errorHandler = err => {
    if (err instanceof Exception) {
      console.log(`【VueErrorHandler】(${err.name})`, err);
    } else {
      console.log(err);
    }
  };

  app.mount("#app");
}

bootstrap().catch(console.log);
