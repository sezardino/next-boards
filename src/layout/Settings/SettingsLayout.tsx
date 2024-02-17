import { type FC } from "react";

import clsx from "clsx";
import { AppLayoutProps } from "../App/AppLayout";

import { IconNames } from "@/components/base/Icon";
import { NavigationList } from "@/components/layout/NavigationList/NavigationList";
import { PageUrls } from "@/const";

import styles from "./SettingsLayout.module.scss";

type Props = {};

export type SettingsLayoutProps = AppLayoutProps & Props;

const links: { label: string; href: string; icon: IconNames }[] = [
  { href: PageUrls.settings.index, label: "General", icon: "Settings" },
  { href: PageUrls.settings.security, label: "Security", icon: "Lock" },
];

export const SettingsLayout: FC<SettingsLayoutProps> = (props) => {
  const { className, children, ...rest } = props;

  return (
    <div {...rest} className={clsx(styles.element, className)}>
      <nav className={styles.nav}>
        <NavigationList links={links} />
      </nav>
      <div className={styles.main}>{children}</div>
    </div>
  );
};
