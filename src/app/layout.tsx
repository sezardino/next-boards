import { SITE_DESCRIPTION, SITE_NAME } from "@/const";
import { getNextAuthSession } from "@/lib/next-auth";
import "@/styles/index.scss";
import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RootProviders } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getNextAuthSession();

  return (
    <html lang="en">
      <body
        className={clsx(inter.className, "dark text-foreground bg-background")}
      >
        <RootProviders session={session}>{children}</RootProviders>
      </body>
    </html>
  );
};

export default RootLayout;
