import { NextAuthMiddlewareOptions } from "next-auth/middleware";

export const nextAuthMiddleware: NextAuthMiddlewareOptions = {
  callbacks: {
    authorized: ({ req, token }) => {
      return true;
    },
  },
};

export default nextAuthMiddleware;
