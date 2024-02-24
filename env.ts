import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string(),
  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
