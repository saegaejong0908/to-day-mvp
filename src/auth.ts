import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/todo") || nextUrl.pathname.startsWith("/goal");
      const isOnLogin = nextUrl.pathname === "/login";

      if (isProtected && !isLoggedIn) {
        return false;
      }
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/todo", nextUrl));
      }
      return true;
    },
  },
});
