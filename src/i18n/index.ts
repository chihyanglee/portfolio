import { en, type TranslationKey } from "./en";
import { zhTW } from "./zh-TW";

export type Lang = "en" | "zh-TW";

const translations: Record<Lang, Record<TranslationKey, string>> = {
  en,
  "zh-TW": zhTW,
};

export function t(key: TranslationKey, lang: Lang): string {
  return translations[lang][key];
}

export function getLangFromUrl(url: URL): Lang {
  const [, firstSegment] = url.pathname.split("/");
  if (firstSegment === "zh") return "zh-TW";
  return "en";
}

export function getLocalePath(lang: Lang): string {
  return lang === "zh-TW" ? "/zh/" : "/";
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === "en" ? "zh-TW" : "en";
}

export function getHtmlLang(lang: Lang): string {
  return lang === "en" ? "en" : "zh-Hant-TW";
}
