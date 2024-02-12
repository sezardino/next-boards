import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, PropsWithChildren, useState } from "react";
import { Toaster } from "sonner";

export const RootProviders: FC<PropsWithChildren> = (props) => {
  const { children } = props;
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
      <Toaster theme="dark" position="top-center" duration={2000} />
    </QueryClientProvider>
  );
};
