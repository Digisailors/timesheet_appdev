import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

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
        if (!credentials) return null

        const loginData = credentials.email
          ? { email: credentials.email, password: credentials.password }
          : { phoneNumber: credentials.phoneNumber, password: credentials.password }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/signin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(loginData),
            }
          )

          const data = await response.json()

          if (response.ok && data.success) {
            return {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              phoneNumber: data.data.phoneNumber,
              isActive: data.data.isActive,
              createdAt: data.data.createdAt,
              updatedAt: data.data.updatedAt,
            }
          }

          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt(params) {
      const { token, user } = params
      
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(token as any).id = (user as any).id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(token as any).phoneNumber = (user as any).phoneNumber
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(token as any).isActive = (user as any).isActive
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(token as any).createdAt = (user as any).createdAt
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(token as any).updatedAt = (user as any).updatedAt
      }
      return token
    },
    async session(params) {
      const { session, token } = params
      
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).id = (token as any).id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).phoneNumber = (token as any).phoneNumber
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).isActive = (token as any).isActive
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).createdAt = (token as any).createdAt
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).updatedAt = (token as any).updatedAt
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
