import { App } from "vue";
import { createI18n } from "vue-i18n";

import { useConfig } from "@/config";
import { PROJECT_LANGS } from "@/constants/common";
import { APP_LOCALE_EXPIRE } from "@/constants/storage-keys";
import { getCookie, setCookie } from "@/util";

const config = useConfig();

const loadedLanguages: Array<string> = [];

export const i18n = createI18n({
  locale: config.DEFAULT_LANGUAGE,
  legacy: false,
  globalInjection: true,
  missingWarn: false,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
});

export function setI18nLang(lang: PROJECT_LANGS) {
  i18n.global.locale.value = lang;
  setCookie(config.COOKIE_LANG_KEY, lang, APP_LOCALE_EXPIRE);
  // TODO: 设置请求相关语言信息
}

/**
 * 加载当前语言包
 * @param lang 当前语言
 */
export async function loadLangResourceAsync(lang?: PROJECT_LANGS) {
  const cookieLang = getCookie(config.COOKIE_LANG_KEY) as PROJECT_LANGS;
  lang = lang || (validateLocale(cookieLang) ? cookieLang : config.DEFAULT_LANGUAGE);

  if (!loadedLanguages.includes(lang)) {
    const langPackage = await (await fetch(`/i18n/${lang}.json?v=${config.__VERSION__}`)).json();
    loadedLanguages.push(lang);
    i18n.global.setLocaleMessage(lang, langPackage);
    setI18nLang(lang);
  } else if (i18n.global.locale.value !== lang) {
    setI18nLang(lang);
  }
}

/**
 * 验证是否合法的语言
 */
export function validateLocale(lang: any) {
  return Object.values(config.LANGUAGES).includes(lang);
}

export async function setupI18n(app: App) {
  app.use(i18n);
  await loadLangResourceAsync();
}
