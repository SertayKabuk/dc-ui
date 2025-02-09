import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/db/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth((req) => {
  if (req) {
    console.log(req); // do something with the request
  }
  return {
    adapter: PrismaAdapter(prisma),
    providers: [Discord],
    callbacks: {
      authorized: async ({ auth }) => {
        // Logged in users are authenticated, otherwise redirect to login page
        return !!auth;
      },
    },
  };
});
