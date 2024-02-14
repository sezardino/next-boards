"use client";

import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren, useState } from "react";
import { Toaster } from "sonner";

type Props = {
  session: Session | null;
};

export const RootProviders: FC<PropsWithChildren<Props>> = (props) => {
  const { session, children } = props;
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: { staleTime: 1000, refetchOnWindowFocus: false },
      },
    })
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={client}>
        <NextUIProvider>
          {children}
          <Toaster theme="dark" position="top-center" duration={2000} />
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
