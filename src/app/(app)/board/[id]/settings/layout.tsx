import { NavigationListLink } from "@/components/layout/NavigationList/NavigationList";
import { PageUrls } from "@/const";
import { WithAsideNavLayout } from "@/layout/WithAsideNav/WithAsideNavLayout";
import { FC, PropsWithChildren } from "react";

type Props = {
  params: { id: string };
};

const layout: FC<Props & PropsWithChildren> = (props) => {
  const {
    children,
    params: { id },
  } = props;

  const links: NavigationListLink[] = [
    { href: PageUrls.board.settings(id), label: "General", icon: "Settings" },
  ];

  return <WithAsideNavLayout links={links}>{children}</WithAsideNavLayout>;
};

export default layout;
