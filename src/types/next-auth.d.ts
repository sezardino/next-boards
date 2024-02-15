import "next-auth";

declare module "next-auth" {
  interface User {
    login: string;
    id: string;
  }

  interface Session {
    user: User;
  }
}
