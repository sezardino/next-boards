import clsx from "clsx";
import { type ComponentPropsWithoutRef, type FC } from "react";

export type TypographyStyling =
  | "xs"
  | "sm"
  | "base"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "7xl";
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

  const stylingString: Record<TypographyStyling, string> = {
    "7xl": "text-7xl lg:text-9xl",
    "3xl": "text-3xl md:text-4xl lg:text-5xl",
    "2xl": "text-2xl lg:text-4xl md:text-3xl",
    xl: "text-xl md:text-2xl lg:text-3xl",
    lg: "text-lg md:text-xl lg:text-2xl",
    md: "text-md md:text-lg lg:text-xl",
    base: "text-base",
    sm: "text-sm",
    xs: "text-xs",
  };

  const weightString: Record<TypographyWeight, string> = {
    regular: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
    thin: "font-thin",
  };

  return (
    <Tag
      {...rest}
      className={clsx(
        stylingString[styling],
        weightString[weight],
        `text-${color}`,
        className
      )}
    >
      {children}
    </Tag>
  );
};
