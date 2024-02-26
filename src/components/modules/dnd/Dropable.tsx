import { UseDroppableArguments, useDroppable } from "@dnd-kit/core";
import { FC, ReactNode } from "react";

type UseDroppableResponse = ReturnType<typeof useDroppable>;

type Props = {
  children: (args: UseDroppableResponse) => ReactNode;
};

export type DroppableProps = UseDroppableArguments & Props;

export const Droppable: FC<DroppableProps> = (props) => {
  const { children, ...rest } = props;
  const droppable = useDroppable(rest);

  return children(droppable);
};
