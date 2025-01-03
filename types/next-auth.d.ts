import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
      user: {
        id: string;
      } & DefaultSession["user"];
    }

    interface Profile extends GoogleProfile {
      picture?: string | null;
    }
  }