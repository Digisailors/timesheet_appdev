import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      if (!token) return false;
      // If we stored expiry on the JWT, block when expired
      const anyToken = token as unknown as { accessTokenExpires?: number };
      if (anyToken?.accessTokenExpires && Date.now() > anyToken.accessTokenExpires) {
        return false;
      }
      return true;
    },
  },
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/employees/:path*",
    "/projects/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/supervisors/:path*",
    "/timesheets/:path*",
    "/vacations/:path*",
  ],
}
