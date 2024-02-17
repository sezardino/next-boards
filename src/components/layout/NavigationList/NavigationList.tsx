import { type ComponentPropsWithoutRef, type FC } from "react";

import { Icon, IconNames } from "@/components/base/Icon";
import { Typography } from "@/components/base/Typography/Typography";
import Link from "next/link";
import styles from "./NavigationList.module.scss";

export type NavigationListLink = {
  label: string;
  href: string;
  icon: IconNames;
};

type Props = {
  links: NavigationListLink[];
};

export type NavigationListProps = ComponentPropsWithoutRef<"ul"> & Props;

export const NavigationList: FC<NavigationListProps> = (props) => {
  const { links, ...rest } = props;

  return (
    <ul {...rest}>
      {links.map((link) => (
        <li key={link.href} className={styles.item}>
          <Link href={link.href} className={styles.link}>
            <Icon name={link.icon} aria-hidden="true" />

            <Typography tag="span" styling="sm">
              {link.label}
            </Typography>
          </Link>
        </li>
      ))}
    </ul>
  );
};
