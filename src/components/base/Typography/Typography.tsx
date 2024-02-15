import clsx from "clsx";
import { type ComponentPropsWithoutRef, type FC } from "react";

import styles from "./Typography.module.scss";

export type TypographyStyling =
  | "xs"
  | "sm"
  | "base"
  | "md"
  | "lg"
  | "xl"
  | "two-xl"
  | "three-xl"
  | "seven-xl";
export type TypographyTag =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "small";

export type TypographyWeight = "regular" | "medium" | "bold" | "thin";
export type TypographyColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "default-500";

type Props = {
  styling?: TypographyStyling;
  tag: TypographyTag;
  weight?: TypographyWeight;
  color?: TypographyColor;
};

export type TypographyProps = ComponentPropsWithoutRef<"p"> & Props;

export const Typography: FC<TypographyProps> = (props) => {
  const {
    color = "default",
    styling = "sm",
    weight = "regular",
    tag: Tag,
    className,
    children,
    ...rest
  } = props;

  return (
    <Tag
      {...rest}
      className={clsx(
        styles.element,
        styles[styling],
        styles[weight],
        `text-${color}`,
        className
      )}
    >
      {children}
    </Tag>
  );
};
