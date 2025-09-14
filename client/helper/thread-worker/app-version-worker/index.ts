import { useConfig } from "@/config";
import { useAppStore } from "@/store";

const config = useConfig();

export function initAppVersionWorker() {
  const worker = new Worker(
    new URL("@/helper/thread-worker/app-version-worker/app-version.worker.ts", import.meta.url)
  );
  worker.addEventListener("message", (e: MessageEvent<{ type: string; data: any }>) => {
    const appVersion = e.data.data.version;
    if (appVersion) {
      if (appVersion !== config.__VERSION__) {
        const appStore = useAppStore();
        appStore.isAppVersionChanged = true;
      }
    }
  });
}
