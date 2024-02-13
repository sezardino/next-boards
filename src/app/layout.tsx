import { SITE_DESCRIPTION, SITE_NAME } from "@/const";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(inter.className, "dark text-foreground bg-background")}
      >
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
