import { Icon, IconNames } from "@/components/base/Icon";
import clsx from "clsx";
import { ComponentPropsWithoutRef, type FC } from "react";

import { Typography } from "@/components/base/Typography/Typography";
import { PageUrls } from "@/const";
import { Chip } from "@nextui-org/react";
import Link from "next/link";
import { NavigationList } from "../NavigationList/NavigationList";
import styles from "./AppSidebar.module.scss";

type Props = {
  isOpen: boolean;
};

const links: { href: string; label: string; icon: IconNames }[] = [
  { href: PageUrls.home, label: "Home", icon: "Home" },
  { href: PageUrls.board.index, label: "Boards", icon: "CircuitBoard" },
  { href: PageUrls.settings.index, label: "Settings", icon: "Settings" },
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
      <nav className={styles.nav}>
        <NavigationList links={links} />
      </nav>
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
