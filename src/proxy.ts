import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALE_COOKIE, acceptLanguageLocale, isLocale } from "@/lib/i18n";
import { getAllProjectMetas } from "@/content";

const ROOT = new Set(["", "/"]);
const PROJECT_SLUGS = new Set(getAllProjectMetas().map(({ slug }) => slug));
const PROJECT_PATH = /^\/(?:pt|en)\/projects\/([^/]+)\/?$/;

function isUnknownProjectPath(pathname: string) {
  const match = PROJECT_PATH.exec(pathname);
  return Boolean(match && !PROJECT_SLUGS.has(match[1]!));
}

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
    // A route-level loading boundary streams its fallback before page.tsx can
    // call notFound(), which otherwise locks the HTTP status at 200. Mark an
    // unknown project path as 404 here, before streaming starts; the App
    // Router still renders the existing localized not-found UI.
    const response = NextResponse.next(
      isUnknownProjectPath(pathname) ? { status: 404 } : undefined,
    );
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
    "/((?!api|_next/static|_next/image|favicon|cv-|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
