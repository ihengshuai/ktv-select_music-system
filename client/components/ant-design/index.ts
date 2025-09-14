import { Card } from "ant-design-vue";
import { App } from "vue";

const Components = [Card];

export function setupAntd(app: App) {
  Components.forEach(component => {
    app.use(component);
  });
}
