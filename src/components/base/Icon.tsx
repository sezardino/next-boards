import clsx from "clsx";
import * as icons from "lucide-react";
import { FC, SVGProps } from "react";

export type IconNames = keyof typeof icons;
export type IconRotate = "45" | "90" | "135" | "180" | "225" | "270" | "315";

type Props = {
  name: IconNames;
  size?: number;
  rotate?: IconRotate;
  className?: string;
};

export type IconProps = SVGProps<SVGSVGElement> & Props;

export const Icon: FC<IconProps> = (props) => {
  const { ref, rotate, name, size = 20, className, ...rest } = props;
  const SelectedIcon = icons[name] as icons.LucideIcon;

  const rotateStyles: Record<IconRotate, string> = {
    "45": "rotate-45",
    "90": "rotate-90",
    "135": "rotate-135",
    "180": "rotate-180",
    "225": "-rotate-135",
    "270": "-rotate-90",
    "315": "-rotate-45",
  };

  return (
    <SelectedIcon
      {...rest}
      size={size}
      className={clsx("rotate", rotate && rotateStyles[rotate], className)}
    />
  );
};
