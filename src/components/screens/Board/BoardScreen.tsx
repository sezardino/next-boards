import { type ComponentPropsWithoutRef, type FC } from "react";

import { Heading } from "@/components/ui/Heading/Heading";
import clsx from "clsx";
import styles from "./BoardScreen.module.scss";

export type BoardScreenProps = ComponentPropsWithoutRef<"div"> & {
  // temp
  boardId: string;
};

export const BoardScreen: FC<BoardScreenProps> = (props) => {
  const { boardId, className, ...rest } = props;

  return (
    <section {...rest} className={clsx(styles.element, className)}>
      <Heading
        title={{ tag: "h1", text: `BoardPage ${boardId}` }}
        withDivider
      />
    </section>
  );
};
