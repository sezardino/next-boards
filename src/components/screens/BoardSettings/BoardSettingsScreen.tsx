import { type ComponentPropsWithoutRef, type FC } from "react";

import { Heading } from "@/components/ui/Heading/Heading";
import clsx from "clsx";
import styles from "./BoardSettingsScreen.module.scss";

export type BoardSettingsScreenProps = ComponentPropsWithoutRef<"div"> & {
  // temp
  boardId: string;
};

export const BoardSettingsScreen: FC<BoardSettingsScreenProps> = (props) => {
  const { boardId, className, ...rest } = props;

  return (
    <section {...rest} className={clsx(styles.element, className)}>
      <Heading
        title={{ tag: "h1", text: `BoardSettingsPage ${boardId}` }}
        withDivider
      />
    </section>
  );
};
