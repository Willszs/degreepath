export type Lang = "zh" | "en";

export type SearchParams = Record<string, string | string[] | undefined>;

export function resolveLang(searchParams: SearchParams | undefined): Lang {
  const raw = searchParams?.lang;
  const lang = Array.isArray(raw) ? raw[0] : raw;
  return lang === "en" ? "en" : "zh";
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "zh" : "en";
}

export function withLang(href: string, lang: Lang): string {
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}lang=${lang}`;
}
