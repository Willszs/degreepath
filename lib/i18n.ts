export type Lang = "zh" | "en";

export const supportedLangs: Lang[] = ["zh", "en"];

export function isLang(value: string): value is Lang {
  return value === "zh" || value === "en";
}

export function resolveLangParam(value: string | undefined): Lang | null {
  if (!value) return null;
  return isLang(value) ? value : null;
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "zh" : "en";
}

export function withLang(path: string, lang: Lang): string {
  const normalizedPath = path === "/" ? "" : path;
  return `/${lang}${normalizedPath}`;
}

export function withoutLangPrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  if (isLang(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}
