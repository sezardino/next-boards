import {
  Button as Component,
  ButtonProps as ComponentProps,
  Tooltip,
} from "@nextui-org/react";
import { ForwardRefRenderFunction, forwardRef } from "react";

type OmittedLibProps = Omit<ComponentProps, "variant" | "radius">;

type Props = {
  variant?: Extract<
    ComponentProps["variant"],
    "solid" | "shadow" | "bordered" | "light"
  >;
  tooltip?: string;
};

export type ButtonProps = OmittedLibProps & Props;

const ButtonComponent: ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonProps
> = (props, ref) => {
  const { tooltip, variant = "solid", color, children, ...rest } = props;

  const button = (
    <Component {...rest} color={color} ref={ref} variant={variant} radius="sm">
      {children}
    </Component>
  );

  if (tooltip) {
    return (
      <Tooltip color={color} content={tooltip}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export const Button = forwardRef(ButtonComponent);
