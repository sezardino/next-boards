import { useMemo, type ComponentPropsWithoutRef, type FC } from "react";

import { Grid } from "@/components/base/Grid/Grid";
import { BoardForm, BoardFormValues } from "@/components/forms/Board/BoardForm";
import { Heading } from "@/components/ui/Heading/Heading";
import { BoardBaseDataResponse } from "@/services/bll/modules/board/dto";
import { ActionProp, DataProp } from "@/types";
import clsx from "clsx";
import styles from "./BoardSettingsScreen.module.scss";

export type BoardSettingsScreenProps = ComponentPropsWithoutRef<"div"> & {
  board: DataProp<BoardBaseDataResponse>;
  updateBoardAction: ActionProp<BoardFormValues, any>;
};

export const BoardSettingsScreen: FC<BoardSettingsScreenProps> = (props) => {
  const { updateBoardAction, board, className, ...rest } = props;

  const formKey = useMemo(
    () =>
      board.data && !("error" in board.data)
        ? `${board.data.title}-${board.data.description}-${board.data.icon}`
        : undefined,
    [board.data]
  );

  return (
    <Grid
      {...rest}
      tag="section"
      gap="4"
      className={clsx(styles.element, className)}
    >
      <Heading title={{ tag: "h1", text: `Base settings` }} withDivider />
      <BoardForm
        key={formKey}
        withConfirm
        type="update"
        board={board.data}
        isLoading={board.isLoading || updateBoardAction.isPending}
        onFormSubmit={updateBoardAction.action}
      />
    </Grid>
  );
};
