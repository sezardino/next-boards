"use client";

import {
  Textarea as Component,
  TextAreaProps as ComponentProps,
} from "@nextui-org/input";
import { ForwardRefRenderFunction, forwardRef } from "react";

type OmittedProps = Omit<
  ComponentProps,
  "variant" | "radius" | "colors" | "onBlur"
>;

type Props = {};

export type TextareaProps = OmittedProps & Props;

const TextareaComponent: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = (props, ref) => {
  const {
    labelPlacement = "outside",
    errorMessage,
    endContent,
    ...rest
  } = props;

  return (
    <Component
      {...rest}
      ref={ref}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      variant="bordered"
      labelPlacement={labelPlacement}
      placeholder={rest.placeholder || " "}
      radius="sm"
    />
  );
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  TextareaComponent
);
