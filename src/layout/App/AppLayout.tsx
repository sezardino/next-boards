"use client";

import { AppHeader } from "@/components/layout/AppHeader/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar/AppSidebar";
import clsx from "clsx";
import { useId, useState, type ComponentPropsWithoutRef, type FC } from "react";

import styles from "./AppLayout.module.scss";

type Props = {};

export type AppLayoutProps = ComponentPropsWithoutRef<"div"> & Props;

export const AppLayout: FC<AppLayoutProps> = (props) => {
  const { className, children, ...rest } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarId = useId();

  return (
    <div {...rest} className={styles.element}>
      <AppSidebar
        id={sidebarId}
        isOpen={isSidebarOpen}
        className={styles.sidebar}
      />
      <AppHeader
        isSidebarOpen={isSidebarOpen}
        sidebarId={sidebarId}
        className={styles.header}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <main className={clsx(styles.main, className)}>{children}</main>
      {isSidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
