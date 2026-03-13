import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
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
    role?: string | null;
    studioId?: string | null;
    status?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    // 🔹 Se ejecuta al iniciar sesión
    async signIn({ profile }) {
      const googleProfile = profile as GoogleProfile;

      if (!googleProfile?.email) return false;

      await connectDB();

      const userExists = await User.findOne({
        email: googleProfile.email,
      });

      if (userExists && userExists.status === "inactive") {
        // Este mensaje es el que aparecerá en la URL ?error=...
        throw new Error("Your account has been deactivated.");
      }

      if (!userExists) {
        const username = googleProfile.name?.slice(0, 20);

        await User.create({
          email: googleProfile.email,
          username,
          image: googleProfile.picture,
        });
      }

      return true;
    },

    // 🔹 MUY IMPORTANTE: Agregamos datos al JWT
    async jwt({ token, user, trigger }) {
      await connectDB();

      // 🔹 Cuando el usuario inicia sesión
      if (user) {
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          if (dbUser.status === "inactive") {
            throw new Error("Inactive user");
          }

          token.id = dbUser._id.toString();
          token.studioId = dbUser.studioId ? dbUser.studioId.toString() : null;
          token.role = dbUser.role || null;
          token.status = dbUser.status || "active";
        }
      }

      // 🔹 Cuando llamás update()
      if (trigger === "update") {
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.studioId = dbUser.studioId ? dbUser.studioId.toString() : null;
          token.role = dbUser.role || null;
          token.status = dbUser.status || "active";
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Pasamos los datos del token (que vienen de la DB) a la sesión del cliente
      if (session.user) {
        session.user.id = token.id as string;
        session.user.studioId = token.studioId;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
