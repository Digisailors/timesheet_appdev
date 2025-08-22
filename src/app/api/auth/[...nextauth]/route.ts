/* eslint-disable */
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        phoneNumber: { label: "Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const loginData = credentials.email
          ? { email: credentials.email, password: credentials.password }
          : { phoneNumber: credentials.phoneNumber, password: credentials.password };
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/signin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(loginData),
            }
          );
          const data = await response.json();
          if (response.ok && data.success) {
            return {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              phoneNumber: data.data.phoneNumber,
              isActive: data.data.isActive,
              createdAt: data.data.createdAt,
              updatedAt: data.data.updatedAt,
              token: data.data.token, // Store the JWT token
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phoneNumber = user.phoneNumber;
        token.isActive = user.isActive;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        if (user.token) {
          token.accessToken = user.token; // Attach the JWT token to the token object
          try {
          // Decode JWT payload to extract exp (in seconds)
          const base64Payload = user.token.split(".")[1];
          const jsonPayload = Buffer.from(base64Payload, "base64").toString("utf8");
          const parsed = JSON.parse(jsonPayload) as { exp?: number };
          if (parsed?.exp) {
            // Store in ms for easy Date.now() comparison
            token.accessTokenExpires = parsed.exp * 1000;
          }
          } catch (e) {
          // If decode fails, do not set expiry; session middleware will handle by 401s
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.phoneNumber = token.phoneNumber;
        session.user.isActive = token.isActive;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
        session.accessToken = token.accessToken; // Attach the JWT token to the session
        session.accessTokenExpires = (token as any).accessTokenExpires;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
