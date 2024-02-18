import { type FC } from "react";

import clsx from "clsx";
import { AppLayoutProps } from "../App/AppLayout";

import {
  NavigationList,
  NavigationListLink,
} from "@/components/layout/NavigationList/NavigationList";

import styles from "./WithAsideNavLayout.module.scss";

type Props = { links: NavigationListLink[] };

export type WithAsideNavLayoutProps = AppLayoutProps & Props;

export const WithAsideNavLayout: FC<WithAsideNavLayoutProps> = (props) => {
  const { links, className, children, ...rest } = props;

  return (
    <div {...rest} className={clsx(styles.element, className)}>
      <nav className={styles.nav}>
        <NavigationList links={links} />
      </nav>
      <div className={styles.main}>{children}</div>
    </div>
  );
};
