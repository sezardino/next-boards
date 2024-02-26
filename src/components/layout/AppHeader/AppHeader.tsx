import { Icon } from "@/components/base/Icon";
import { type ComponentPropsWithoutRef, type FC } from "react";

import { Button } from "@/components/base/Button";
import styles from "./AppHeader.module.scss";

type Props = {
  onSidebarToggle: () => void;
  sidebarId: string;
  isSidebarOpen: boolean;
};

export type AppHeaderProps = ComponentPropsWithoutRef<"div"> & Props;

export const AppHeader: FC<AppHeaderProps> = (props) => {
  const { isSidebarOpen, sidebarId, onSidebarToggle, className, ...rest } =
    props;

  return (
    <header {...rest} className={styles.element}>
      <nav className={styles.nav}>
        <Button
          isIconOnly
          variant="light"
          className={styles.toggler}
          onClick={onSidebarToggle}
          aria-expanded={isSidebarOpen}
          aria-controls={sidebarId}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Icon name="Menu" size={24} />
        </Button>

        {/* add user dropdown */}
        <div className="ml-auto">dropdown</div>
      </nav>
    </header>
  );
};
