import { useSortable, UseSortableArguments } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, ReactNode, type FC } from "react";

type UseSortableResponse = ReturnType<typeof useSortable>;

type Props = {
  children: (
    args: UseSortableResponse & { style?: CSSProperties }
  ) => ReactNode;
};

export type SortableProps = UseSortableArguments & Props;

export const Sortable: FC<SortableProps> = (props) => {
  const { children, ...rest } = props;
  const sortable = useSortable(rest);

  const style = {
    transition: sortable.transition,
    transform: CSS.Translate.toString(sortable.transform),
  };

  return children({ ...sortable, style });
};
