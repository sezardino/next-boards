"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  PropsWithChildren,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

export interface providerProps extends ComponentPropsWithoutRef<"div"> {}

export const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: { staleTime: 1000, refetchOnWindowFocus: false },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
