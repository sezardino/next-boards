import { AppLayout } from "@/layout/App/AppLayout";
import { PropsWithChildren, type FC } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <AppLayout>{children}</AppLayout>
);

export default Layout;
