import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      studioId: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    studioId: string;
  }
}
