import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import connectDB from "@/config/database";
import User from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      studioId?: string | null;
      status?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
    role?: string | null;
    studioId?: string | null;
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
          role: user.role,
          studioId: user.studioId,
          status: user.status,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      // Usuarios reales (Google)
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
          });
        }
      }

      // Usuarios demo (credentials) → siempre true
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
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id!,
        email: token.email!,
        role: token.role,
        studioId: token.studioId,
        status: token.status,
      };
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
