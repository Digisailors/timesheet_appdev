// Type declarations for NextAuth

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      phoneNumber: string
      isActive: boolean
      createdAt: string
      updatedAt: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    phoneNumber: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    phoneNumber: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}
