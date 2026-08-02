/// <reference types="vitest" />

import babel from "@rollup/plugin-babel";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import compression from "vite-plugin-compression";

import { envConfig, __isDev__ } from "./scripts/env";
import { resolvePath } from "./scripts/util";
import { viteManifestPlugin } from "./scripts/vite/vite-manifest-plugin";

const outDir = resolvePath(envConfig.CLIENT_OUTDIR);

// https://vitejs.dev/config/
export default async () => {
  const Unocss = (await import("unocss/vite")).default;

  const plugins = [
    vue(),
    vueJsx(),
    babel({
      compact: false,
      skipPreflightCheck: true,
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      plugins: [
        "babel-plugin-transform-typescript-metadata",
        ["@babel/plugin-proposal-decorators", { version: "legacy" }],
        ["@babel/plugin-transform-class-properties", { loose: true }],
      ],
    }),
    Unocss(),
    viteManifestPlugin(),
  ];

  if (__isDev__) {
    plugins.push(
      compression({
        algorithm: "gzip",
      })
    );
  }

  if (!__isDev__ && envConfig.BUNDLE_ANALYZER) {
    plugins.push(analyzer());
  }

  return defineConfig({
    base: __isDev__ ? "/" : envConfig.VITE_BASE_URL,
    resolve: {
      alias: {
        "@": resolvePath("client"),
        "~": resolvePath("."),
      },
    },

    // 全局常量
    define: {
      __isDev__,
      "import.meta.env.VITE_COOKIE_DOMAIN": JSON.stringify(envConfig.COOKIE_DOMAIN),
      "import.meta.env.VITE_COOKIE_LANG_KEY": JSON.stringify(envConfig.COOKIE_LANG_KEY),
      "import.meta.env.VITE_LANGUAGES": JSON.stringify(envConfig.LANGUAGES),
      "import.meta.env.VITE_DEFAULT_LANGUAGE": JSON.stringify(envConfig.DEFAULT_LANGUAGE),
      "import.meta.env.VITE___VERSION__": JSON.stringify(envConfig.VERSION),
      "import.meta.env.VITE_APP_TITLE": JSON.stringify(envConfig.APP_TITLE),
      "import.meta.env.VITE_API_PREFIX": JSON.stringify(envConfig.API_PREFIX),
      "import.meta.env.VITE_APP_ID": JSON.stringify(envConfig.APP_ID),
    },

    // 构建
    build: {
      manifest: true,
      outDir,
      target: "es2015",
      cssTarget: "chrome80",
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      modulePreload: {},
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name].[hash:6].js",
          assetFileNames: "assets/[name].[hash:6].[ext]",
          manualChunks: {
            echarts: ["echarts"],
            vue: ["vue", "pinia", "vue-router"],
            antd: ["ant-design-vue", "@ant-design/icons-vue"],
          },
        },
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
        },
      },
    },

    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "ant-design-vue/es/locale/zh_CN",
        "ant-design-vue/es/locale/en_US",
      ],
    },

    plugins,

    test: {
      globals: true,
      environment: "jsdom",
      include: ["__test__/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
      setupFiles: ["__test__/unit/setup/setup.ts"],
      globalSetup: ["__test__/unit/setup/setup.global.ts"],
    },
  });
};
