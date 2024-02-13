"use client";

import {
  Tabs as NextUITabs,
  TabsProps as NextUITabsProps,
  Tab,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type TabItem<T extends string> = {
  id: T;
  title: string;
  href?: string;
  disabled?: boolean;
};

type Props<T extends string> = {
  items: TabItem<T>[];
  title: string;
  selected?: T;
  onSelectedChange?: (key: T) => void;
};

type OmittedTabProps = Omit<
  NextUITabsProps,
  "items" | "variant" | "aria-label" | "selectedKey" | "onSelectionChange"
>;

export type TabProps<T extends string> = OmittedTabProps & Props<T>;

export const Tabs = <T extends string>(props: TabProps<T>) => {
  const { onSelectedChange, selected, items, title, className, ...rest } =
    props;

  const pathname = usePathname();

  return (
    <NextUITabs
      {...rest}
      variant="bordered"
      selectedKey={selected && onSelectedChange ? selected : pathname}
      onSelectionChange={
        selected && onSelectedChange
          ? (key) => onSelectedChange(key as T)
          : undefined
      }
      aria-label={title}
    >
      {items.map((item) => (
        <Tab
          key={item.id}
          as={item.href && !item.disabled ? Link : "button"}
          disabled={item.disabled}
          href={item.href && !item.disabled ? item.href : undefined}
          title={item.title}
        />
      ))}
    </NextUITabs>
  );
};
