"use client";

import {
  Input as Component,
  InputProps as ComponentProps,
} from "@nextui-org/input";
import {
  FocusEvent,
  ForwardRefRenderFunction,
  forwardRef,
  useState,
} from "react";
import { Icon } from "./Icon";

type OmittedProps = Omit<
  ComponentProps,
  "variant" | "radius" | "colors" | "onBlur"
>;

type Props = {
  onBlur?: (evt: FocusEvent<HTMLInputElement, Element>) => void;
};

export type InputProps = OmittedProps & Props;

const InputComponent: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  props,
  ref
) => {
  const {
    labelPlacement = "outside",
    errorMessage,
    endContent,
    type,
    ...rest
  } = props;
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const currentType =
    type !== "password" ? type : isVisible ? "text" : "password";

  const endContentJSX =
    type === "password" ? (
      <button
        className="text-default-400 focus:outline-none focus-within:text-primary-500"
        type="button"
        onClick={toggleVisibility}
      >
        <Icon
          name={isVisible ? "EyeOff" : "Eye"}
          className="text-2xl pointer-events-none"
        />
      </button>
    ) : (
      endContent
    );

  return (
    // @ts-ignore
    <Component
      {...rest}
      ref={ref}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      type={currentType}
      variant="bordered"
      labelPlacement={labelPlacement}
      placeholder={rest.placeholder || " "}
      radius="sm"
      endContent={endContentJSX}
    />
  );
};

export const Input = forwardRef<HTMLInputElement, InputProps>(InputComponent);
