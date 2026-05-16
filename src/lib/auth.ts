import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Handle OAuth sign-ins by creating/upserting the user in DB
      if (account && (account.provider === "google" || account.provider === "facebook")) {
        if (!user.email) return false;

        const emailPrefix = user.email.split("@")[0];
        // Sanitize username: keep alphanumeric and underscores, max 30 chars
        const baseUsername = emailPrefix.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 30);
        // Use name-derived username if available
        const nameUsername = user.name
          ? user.name.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 30)
          : baseUsername;

        const randomHash = await bcrypt.hash(Math.random().toString(36), 10);

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Check if username is taken and make it unique if needed
            let username = nameUsername;
            const taken = await prisma.user.findUnique({ where: { username } });
            if (taken) {
              username = `${nameUsername}_${Date.now().toString(36)}`.slice(0, 30);
            }

            await prisma.user.create({
              data: {
                email: user.email,
                username,
                passwordHash: randomHash,
              },
            });
          }
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      if (!token.id && token.email) {
        // For OAuth users, fetch DB id on first JWT creation
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
