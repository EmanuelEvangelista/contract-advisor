import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import connectDB from "@/config/database";
import User from "@/models/User";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string | null;
    role: string | null;
    studioId: string | null;
    status?: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
    role: string | null;
    studioId: string | null;
    status?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // GOOGLE LOGIN (usuarios reales)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // CREDENTIALS LOGIN (solo usuarios demo)
    CredentialsProvider({
      name: "Demo Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user) throw new Error("User not found");

        // Comparación simple para demo
        if (credentials.password !== user.password) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          role: user.role || "user",
          studioId: user.studioId?.toString() || null,
          status: user.status ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        if (!user.email) return false; // 🔥 importante

        let dbUser = await User.findOne({ email: user.email });

        // ✅ Crear usuario si no existe
        if (!dbUser) {
          dbUser = await User.create({
            email: user.email,
            username: user.name,
            role: null,
            studioId: null,
            status: "active",
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.studioId = user.studioId;
        token.status = user.status;
      }

      // 🔥 FIX IMPORTANTE
      if (!token.email) return token;

      if (token.email) {
        await connectDB();

        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role || null;
          token.studioId = dbUser.studioId?.toString() || null;
          token.status = dbUser.status || "active";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id!;
        session.user.email = token.email!;
        session.user.role = token.role;
        session.user.studioId = token.studioId;
        session.user.status = token.status;
      }
      return session;
    },
  },

  pages: {
    signIn: "/onboarding",
    error: "/",
  },

  session: {
    strategy: "jwt",
  },
};
