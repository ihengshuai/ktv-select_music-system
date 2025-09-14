import { writeFileSync } from "fs";
import { Plugin } from "vite";
import { cwd } from "process";
import path from "path";
import { envConfig } from "../env";

/** 定义一些发布清单 */
const manifest = {
  baseURL: envConfig.VITE_BASE_URL,
  version: envConfig.VERSION,
};

export function viteManifestPlugin(): Plugin {
  return {
    name: "vite-manifest-plugin",
    writeBundle() {
      console.log("%c 正在打包版本配置文件...", "color:red");
      writeFileSync(path.resolve(cwd(), `${envConfig.CLIENT_OUTDIR}/manifest.json`), JSON.stringify(manifest));
    },
  };
}
