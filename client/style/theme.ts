// ant design4 使用 configProvider 动态配置theme

import { ThemeConfig } from "ant-design-vue/es/config-provider/context";
import { GlobalToken } from "ant-design-vue/es/theme";

import { deepMerge } from "@/util";

const baseTheme: ThemeConfig = {
  token: {
    colorPrimary: "#646cff",
  },
};

export const lightTheme: ThemeConfig = deepMerge(baseTheme, {
  token: {
    colorTextBase: "#333",
    colorBgBase: "#fff",
    colorBgLayout: "#efefef",
  },
});

export const darkTheme: ThemeConfig = deepMerge(baseTheme, {
  token: {
    colorTextBase: "#dfdfdf",
    colorBgBase: "#212121",
    colorBgLayout: "#333",
    colorBorder: "#999",
    colorBgElevated: "#333",
    colorBgSpotlight: "#555",
    colorPrimaryBg: "#555",
    colorPrimaryBgHover: "#555",
    colorBorderSecondary: "#444",
    // colorPrimaryBorder: "red",
    // boxShadowSecondary: "red",
    // boxShadowTertiary: "red",
    // colorPrimaryHover: "#666",
    colorErrorBg: "#555",
  },
});

export const setThemeVar = (token: GlobalToken) => {
  return `
    :root {
      --color-text: ${token.colorTextBase};
      --color-text-secondary: ${token.colorTextSecondary};
      --color-placeholder: ${token.colorTextPlaceholder};
      --color-border: ${token.colorBorderSecondary};
      --color-bg-base: ${token.colorBgBase};
      --primary-color: ${token.colorPrimary};
    }
  `;
};
