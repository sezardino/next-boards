import { AppLayout } from "@/layout/App/AppLayout";
import { FC, PropsWithChildren } from "react";

const layout: FC<PropsWithChildren> = ({ children }) => (
  <AppLayout>{children}</AppLayout>
);

export default layout;
