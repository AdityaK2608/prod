import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "preppath_session";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value === "1";
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/exam-setup");
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Supabase can retain a refreshable auth session. PrepPath additionally
  // requires our short-lived browser-session marker, so a fresh browser
  // session must authenticate again.
  const authenticatedForThisBrowserSession = Boolean(user && sessionCookie);

  if (isProtected && !authenticatedForThisBrowserSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthPage && authenticatedForThisBrowserSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = { matcher: ["/dashboard/:path*", "/exam-setup/:path*", "/login", "/signup"] };
