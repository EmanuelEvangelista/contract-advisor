import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import connectDB from "@/config/database";
import User from "@/models/User";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
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
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        const googleProfile = profile as GoogleProfile;
        const userExists = await User.findOne({ email: googleProfile.email });

        if (userExists?.status === "inactive") {
          throw new Error("Your account has been deactivated.");
        }

        if (!userExists) {
          await User.create({
            email: googleProfile.email,
            username: googleProfile.name?.slice(0, 20),
            image: googleProfile.picture,
            // Aquí podrías asignar un role/studioId por defecto si fuera necesario
          });
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // 1. Al iniciar sesión por primera vez (user existirá)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.studioId = user.studioId;
        token.status = user.status;
      }

      // 2. PROBLEMA GOOGLE: Si es Google, 'user' no tiene el ID de Mongo la primera vez
      // Forzamos una búsqueda en DB si el token no tiene los datos que necesitamos
      if (!token.studioId || token.id?.length !== 24) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role || "user";
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
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },
};
