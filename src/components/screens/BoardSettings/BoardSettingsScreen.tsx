import { type ComponentPropsWithoutRef, type FC } from "react";

import { Grid } from "@/components/base/Grid/Grid";
import { BoardForm } from "@/components/forms/Board/BoardForm";
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
    <Grid
      {...rest}
      tag="section"
      gap="4"
      className={clsx(styles.element, className)}
    >
      <Heading title={{ tag: "h1", text: `Base settings` }} withDivider />

      <BoardForm type="update" onFormSubmit={async () => undefined} />
    </Grid>
  );
};
