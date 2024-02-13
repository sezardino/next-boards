import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";

type GridTags = Extract<
  ElementType,
  "header" | "div" | "ul" | "ol" | "section" | "form" | "li" | "article"
>;

export type GridProps<Tag extends GridTags> = ComponentPropsWithoutRef<Tag> & {
  tag?: Tag;
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

const GridComponent: ForwardRefRenderFunction<
  HTMLDivElement,
  GridProps<GridTags>
> = (props, ref) => {
  const {
    tag: Tag = "div",
    col = 1,
    gap = 1,
    children,
    className,
    ...rest
  } = props;

  const columns = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  };

  const gaps = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    7: "gap-7",
    8: "gap-8",
    9: "gap-9",
    10: "gap-10",
    11: "gap-11",
    12: "gap-12",
  };

  return (
    <Tag
      {...rest}
      // @ts-ignore
      ref={ref}
      className={twMerge("grid", columns[col], gaps[gap], className)}
    >
      {children}
    </Tag>
  );
};

export const Grid = forwardRef(GridComponent);
