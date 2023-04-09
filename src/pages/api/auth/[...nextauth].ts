import NextAuth, { RequestInternal } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import config from "../../../../auth";

interface Credentials {
  email: string;
  password: string;
}

type User = {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: string;
  token: string;
  access: boolean;
};

export default NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(
        credentials: Record<"email" | "password", string>,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ) {
        const { email, password }: Credentials = credentials;
        const user = await config(email, password);
        if (user) {
          return user._user;
        } else {
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          user: {
            ...user,
          },
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },

    async signIn({ user }) {
      // @ts-ignore
      if (user.access! === true) {
        return true;
      } else {
        return false;
      }
    },
  },
});
