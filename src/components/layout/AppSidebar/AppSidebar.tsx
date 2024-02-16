import { Icon, IconNames } from "@/components/base/Icon";
import clsx from "clsx";
import { ComponentPropsWithoutRef, type FC } from "react";

import { Typography } from "@/components/base/Typography/Typography";
import { PageUrls } from "@/const";
import { Chip } from "@nextui-org/react";
import Link from "next/link";
import styles from "./AppSidebar.module.scss";

type Props = {
  isOpen: boolean;
};

const links: { href: string; label: string; icon: IconNames }[] = [
  { href: PageUrls.home, label: "Home", icon: "Home" },
  { href: "/2", label: "Settings", icon: "Settings" },
  { href: "/3", label: "Profile", icon: "User" },
];

export type AppSidebarProps = ComponentPropsWithoutRef<"aside"> & Props;

export const AppSidebar: FC<AppSidebarProps> = (props) => {
  const { isOpen, className, ...rest } = props;

  return (
    <aside
      {...rest}
      className={clsx(styles.element, isOpen && styles.open, className)}
      aria-label="side navigation"
    >
      <Link href={PageUrls.home} className={styles.brand}>
        <Icon name="GanttChartSquare" size={40} />{" "}
        <Typography tag="small" styling="md" weight="bold">
          Next Boards
        </Typography>
        <Chip
          size="sm"
          variant="bordered"
          color="primary"
          className={styles.badge}
        >
          <Typography tag="small" styling="xs">
            BETA
          </Typography>
        </Chip>
      </Link>
      <ul className={styles.list}>
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
      <a
        href="https://github.com/sezardino/next-boards"
        target="_blank"
        className={styles.git}
      >
        <Icon name="Github" />
        <Typography tag="span" styling="sm">
          Github
        </Typography>
      </a>
    </aside>
  );
};
