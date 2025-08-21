/* eslint-disable */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    token?: string;
  }

  interface Session {
    user: User;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    accessToken?: string;
  }
}
