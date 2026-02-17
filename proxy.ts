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

function getPathLang(pathname: string): Lang | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return normalizeLang(first);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname === "/admin/") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/index.html";
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  const pathLang = getPathLang(request.nextUrl.pathname);
  const queryLang = normalizeLang(request.nextUrl.searchParams.get("lang"));
  const cookieLang = normalizeLang(request.cookies.get("degreepath-lang")?.value);
  const fallbackLang = detectLangFromAcceptLanguage(request.headers.get("accept-language"));
  const lang = pathLang ?? queryLang ?? cookieLang ?? fallbackLang;

  if (!pathLang) {
    const redirectUrl = request.nextUrl.clone();
    const normalizedPath = pathname === "/" ? "" : pathname;
    const redirectLang = queryLang ?? lang;
    redirectUrl.pathname = `/${redirectLang}${normalizedPath}`;
    redirectUrl.searchParams.delete("lang");
    return NextResponse.redirect(redirectUrl, 308);
  }

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
