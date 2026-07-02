import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Detect user locale from Accept-Language header on first visit
 * and set a cookie so the client can read it.
 * If user has already chosen a language (cookie exists), respect it.
 */
export function middleware(request: NextRequest) {
  const cookieName = "portfolio-lang";
  const existing = request.cookies.get(cookieName)?.value;

  // Already has a language preference — let it through
  if (existing === "pt" || existing === "en") {
    return NextResponse.next();
  }

  // Detect from Accept-Language header
  const acceptLang = request.headers.get("accept-language")?.toLowerCase() || "";
  let detected: "pt" | "en" = "pt"; // default to pt (user is Brazilian, primary audience)

  if (acceptLang.includes("pt")) {
    detected = "pt";
  } else if (acceptLang.includes("en")) {
    detected = "en";
  }

  // Set cookie so client knows the server-detected language
  const response = NextResponse.next();
  response.cookies.set(cookieName, detected, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    // Run on all pages except static assets
    "/((?!api|_next/static|_next/image|favicon|og-image|cv-).*)",
  ],
};
