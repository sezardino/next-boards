import { BoardLayout } from "@/layout/Board/BoardLayout";
import { FC, PropsWithChildren } from "react";

type Props = {
  params: { id: string };
};

const layout: FC<Props & PropsWithChildren> = ({ children, ...props }) => (
  <BoardLayout {...props}>{children}</BoardLayout>
);

export default layout;
