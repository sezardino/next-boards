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
import { Icon } from "../Icon";

import styles from "./Input.module.scss";

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
        className={styles.button}
        type="button"
        onClick={toggleVisibility}
      >
        <Icon name={isVisible ? "EyeOff" : "Eye"} className={styles.icon} />
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
