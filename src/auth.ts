import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/db/prisma";
import { Adapter } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [Discord({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    // profile(profile) {
    //   return {
    //     id: profile.id,
    //     name: profile.username,
    //     email: profile.email,
    //     image: profile.image_url ?? profile.avatar ?? null,
    //     role: profile.role ?? "none",
    //   }
    // },
  })],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role,
        },
      }
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});