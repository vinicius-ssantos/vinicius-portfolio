import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  acceptLanguageLocale,
  isLocale,
} from "@/lib/i18n";

const ROOT = new Set(["", "/"]);

function pickLocale(request: NextRequest) {
  const cookiePref = request.cookies.get(LOCALE_COOKIE)?.value;
  return isLocale(cookiePref)
    ? cookiePref
    : acceptLanguageLocale(request.headers.get("accept-language") ?? "");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (firstSegment && isLocale(firstSegment)) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, firstSegment, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  if (ROOT.has(pathname)) {
    const locale = pickLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|cv-|robots.txt|sitemap.xml).*)",
  ],
};
