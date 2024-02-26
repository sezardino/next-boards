"use client";

import { BoardFormValues } from "@/components/forms/Board/BoardForm";
import { BoardSettingsScreen } from "@/components/screens/BoardSettings/BoardSettingsScreen";
import { useBoardBaseDataMutation } from "@/hooks/mutations/board/base-data";
import { useBoardBaseDataQuery } from "@/hooks/queries/boards/base-data";
import { FC, useCallback } from "react";

type Props = { params: { id: string } };

export const BoardSettingsPageWrapper: FC<Props> = (props) => {
  const { id } = props.params;
  const { data: board, isFetching: isBoardLoading } = useBoardBaseDataQuery(id);

  const { mutateAsync: updateBoard, isPending: usUpdateBoardLoading } =
    useBoardBaseDataMutation();

  const updateBoardHandler = useCallback(
    async (values: BoardFormValues) => {
      if (!id) return;

      try {
        return await updateBoard({ id, ...values });
      } catch (error) {}
    },
    [id, updateBoard]
  );

  return (
    <BoardSettingsScreen
      updateBoardAction={{
        action: updateBoardHandler,
        isPending: usUpdateBoardLoading,
      }}
      board={{ data: board, isLoading: isBoardLoading }}
    />
  );
};
