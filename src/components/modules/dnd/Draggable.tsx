import { useDraggable, UseDraggableArguments } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, ReactNode, type FC } from "react";

type UseDraggableResponse = ReturnType<typeof useDraggable>;

type Props = {
  children: (
    args: UseDraggableResponse & { style?: CSSProperties }
  ) => ReactNode;
};

export type DraggableProps = UseDraggableArguments & Props;

export const Draggable: FC<DraggableProps> = (props) => {
  const { children, ...rest } = props;
  const draggable = useDraggable(rest);

  const style = draggable.transform
    ? { transform: CSS.Translate.toString(draggable.transform) }
    : undefined;

  return children({ ...draggable, style });
};
