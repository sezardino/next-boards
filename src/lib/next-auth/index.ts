import NextAuth, { getServerSession } from "next-auth";
import { nextAuthOptions } from "./options";

export const nextAuthHandler = NextAuth(nextAuthOptions);

export const getNextAuthSession = () => getServerSession(nextAuthOptions);
