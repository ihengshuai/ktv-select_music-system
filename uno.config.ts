// https://unocss.dev/guide/
import { defineConfig, Preset, type UserConfig, presetUno, presetIcons } from "unocss";

const basePreset: Preset = {
  name: "BasePreset",
  rules: [
    [/^p-([.\d]+)$/, ([, num]) => ({ padding: `${num}px` })],
    [/^p-v-([.\d]+)$/, ([, num]) => ({ padding: `${num}px 0px` })],
    [/^p-h-([.\d]+)$/, ([, num]) => ({ padding: `0px ${num}px` })],
  ],
};

export default defineConfig<UserConfig>({
  presets: [
    basePreset,
    presetUno,
    presetIcons({
      collections: {},
    }),
  ],
  rules: [[/^m-(\d+)$/, ([, num]) => ({ margin: `${num}px` })]],
});
