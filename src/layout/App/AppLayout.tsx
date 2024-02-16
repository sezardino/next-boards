"use client";

import { AppHeader } from "@/components/layout/AppHeader/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar/AppSidebar";
import clsx from "clsx";
import { useId, useState, type ComponentPropsWithoutRef, type FC } from "react";

import styles from "./AppLayout.module.scss";

export interface AppLayoutProps extends ComponentPropsWithoutRef<"div"> {}

export const AppLayout: FC<AppLayoutProps> = (props) => {
  const { className, children, ...rest } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarId = useId();

  return (
    <div {...rest} className={clsx(styles.element, className)}>
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
      <main className={styles.main}>{children}</main>
      {isSidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
