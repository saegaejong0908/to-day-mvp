import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLogin = req.nextUrl.pathname === "/login";

  if (!isLoggedIn && !isOnLogin && req.nextUrl.pathname.startsWith("/todo")) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn && isOnLogin) {
    return Response.redirect(new URL("/todo", req.nextUrl));
  }

  return undefined;
});

export const config = {
  matcher: ["/todo/:path*", "/goal/:path*", "/login"],
};
