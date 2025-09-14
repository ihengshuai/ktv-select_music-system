import { createPinia } from "pinia";
import { App } from "vue";

export const pinia = createPinia();

export function setupStore(app: App) {
  app.use(pinia);
}
export * from "./modules/app";
export * from "./modules/user";
