import "next-auth";

declare module "next-auth" {
  interface User {
    email: string;
    id: string;
  }

  interface Session {
    user: User;
  }
}
