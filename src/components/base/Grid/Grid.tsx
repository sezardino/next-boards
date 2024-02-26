import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
} from "react";

import clsx from "clsx";
import styles from "./Grid.module.scss";

type GridTags = Extract<
  ElementType,
  "header" | "div" | "ul" | "ol" | "section" | "form" | "li" | "article"
>;

export type GridProps<Tag extends GridTags> = ComponentPropsWithoutRef<Tag> & {
  tag?: Tag;
  col?:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12";
  gap?:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12";
};

const GridComponent: ForwardRefRenderFunction<
  HTMLDivElement,
  GridProps<GridTags>
> = (props, ref) => {
  const {
    tag: Tag = "div",
    col = "1",
    gap = "1",
    children,
    className,
    ...rest
  } = props;

  return (
    <Tag
      {...rest}
      // @ts-ignore
      ref={ref}
      className={clsx(
        styles.element,
        styles[`c-${col}`],
        styles[`g-${gap}`],
        className
      )}
    >
      {children}
    </Tag>
  );
};

export const Grid = forwardRef(GridComponent);
