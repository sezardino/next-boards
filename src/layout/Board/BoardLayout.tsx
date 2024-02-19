import { useMemo, type ComponentPropsWithoutRef, type FC } from "react";

import {
  NavigationList,
  NavigationListLink,
} from "@/components/layout/NavigationList/NavigationList";
import { PageUrls } from "@/const";
import clsx from "clsx";
import styles from "./BoardLayout.module.scss";

type Props = {
  params: { id: string };
};

export type BoardLayoutProps = ComponentPropsWithoutRef<"div"> & Props;

export const BoardLayout: FC<BoardLayoutProps> = (props) => {
  const { className, params, children, ...rest } = props;

  const links = useMemo<NavigationListLink[]>(
    () => [
      {
        href: PageUrls.board.id(params.id),
        label: "Tasks",
        icon: "Columns",
      },
      {
        href: PageUrls.board.settings(params.id),
        label: "Settings",
        icon: "Settings",
      },
    ],
    [params.id]
  );

  return (
    <div {...rest} className={clsx(styles.element, className)}>
      <nav className={styles.nav}>
        <NavigationList orientation="horizontal" size="sm" links={links} />
      </nav>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
