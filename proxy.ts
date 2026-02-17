import { NextResponse, type NextRequest } from "next/server";

type Lang = "zh" | "en";

function normalizeLang(raw: string | null | undefined): Lang | null {
  if (raw === "zh" || raw === "en") return raw;
  return null;
}

function detectLangFromAcceptLanguage(raw: string | null): Lang {
  if (!raw) return "zh";
  return raw.toLowerCase().includes("en") ? "en" : "zh";
}

export function proxy(request: NextRequest) {
  const queryLang = normalizeLang(request.nextUrl.searchParams.get("lang"));
  const cookieLang = normalizeLang(request.cookies.get("degreepath-lang")?.value);
  const fallbackLang = detectLangFromAcceptLanguage(request.headers.get("accept-language"));
  const lang = queryLang ?? cookieLang ?? fallbackLang;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-degreepath-lang", lang);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.cookies.set("degreepath-lang", lang, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
