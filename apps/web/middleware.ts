import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

// Auth is active only when Convex is configured. In mock/dogfood mode
// (no NEXT_PUBLIC_CONVEX_URL) the middleware is a passthrough — no login needed.
const AUTH_ENABLED = !!process.env.NEXT_PUBLIC_CONVEX_URL;

const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/projects(.*)", "/settings(.*)"]);

export default AUTH_ENABLED
  ? convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
      if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/dashboard");
      }
      if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/signin");
      }
    })
  : () => NextResponse.next();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
