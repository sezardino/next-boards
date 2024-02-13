import { Typography, TypographyProps } from "@/components/base/Typography";
import clsx from "clsx";
import { type ComponentPropsWithoutRef, type FC } from "react";

type PickedProps = Pick<
  TypographyProps,
  "styling" | "tag" | "color" | "weight"
>;

type Props = {
  title: { text: string } & Pick<
    TypographyProps,
    "styling" | "tag" | "color" | "weight"
  >;
  description?: { text: string } & Pick<
    TypographyProps,
    "styling" | "color" | "weight"
  >;
  as?: "header" | "div";
  withDivider?: boolean;
};

export type HeadingProps = Omit<ComponentPropsWithoutRef<"div">, "title"> &
  Props;

export const Heading: FC<HeadingProps> = (props) => {
  const {
    withDivider,
    title,
    description,
    as: As = "div",
    className,
    ...rest
  } = props;

  const {
    text: descriptionText,
    styling: descriptionStyling = "sm",
    color: descriptionColor = "default-500",
    weight: descriptionWeight = "regular",
    ...restDescription
  } = description || {};
  const {
    text: titleText,
    styling: titleStyling = "3xl",
    color: titleColor = "default",
    weight: titleWeight = "bold",
    ...restTitle
  } = title;

  return (
    <As {...rest} className={clsx(withDivider && "pb-4 border-b", className)}>
      <Typography
        styling={titleStyling}
        color={titleColor}
        weight={titleWeight}
        {...restTitle}
      >
        {title.text}
      </Typography>
      {description && (
        <Typography
          tag="p"
          styling={descriptionStyling}
          color={descriptionColor}
          weight={descriptionWeight}
          {...restDescription}
        >
          {descriptionText}
        </Typography>
      )}
    </As>
  );
};
