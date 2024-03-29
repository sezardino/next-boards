import { PageUrls } from "@/const/url";
import { bllService } from "@/services/bll";

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "login", placeholder: "login" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.login || !credentials.password)
          return Promise.reject({ message: "no credentials" });

        try {
          const res = await bllService.auth.signIn(credentials);

          if (res && "id" in res) return res;

          return Promise.reject({ message: "not found" });
        } catch (error) {
          console.log(error);
          return Promise.reject({
            message: (error as { error: string }).error,
          });
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
  },

  pages: {
    signIn: PageUrls.auth,
    error: PageUrls.auth,
    signOut: PageUrls.auth,
  },

  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          login: token.login,
          name: token.name,
        },
      };
    },

    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          login: user.login,
          name: user.name,
        };
      }
      return token;
    },
  },
};
