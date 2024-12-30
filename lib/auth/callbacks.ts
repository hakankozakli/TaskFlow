import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authCallbacks = {
  async jwt({ token, user }: { token: JWT; user: any }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },

  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user) {
      session.user.id = token.id as string;
    }
    return session;
  },
};