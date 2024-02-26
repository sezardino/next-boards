"use client";

import { BoardFormValues } from "@/components/forms/Board/BoardForm";
import { BoardSettingsScreen } from "@/components/screens/BoardSettings/BoardSettingsScreen";
import { useArchiveBoardMutation } from "@/hooks/mutations/board/archive";
import { useBoardBaseDataMutation } from "@/hooks/mutations/board/base-data";
import { useDeleteBoardMutation } from "@/hooks/mutations/board/delete";
import { useBoardBaseDataQuery } from "@/hooks/queries/boards/base-data";
import { FC, useCallback } from "react";

type Props = { params: { id: string } };

export const BoardSettingsPageWrapper: FC<Props> = (props) => {
  const { id } = props.params;
  const { data: board, isFetching: isBoardLoading } = useBoardBaseDataQuery(id);

  const { mutateAsync: updateBoard, isPending: usUpdateBoardLoading } =
    useBoardBaseDataMutation();
  const { mutateAsync: deleteBoard, isPending: isDeleteBoardPending } =
    useDeleteBoardMutation();
  const { mutateAsync: archiveBoard, isPending: isArchiveBoardPending } =
    useArchiveBoardMutation();

  const updateBoardHandler = useCallback(
    async (values: BoardFormValues) => {
      if (!id) return;

      try {
        return await updateBoard({ id, ...values });
      } catch (error) {}
    },
    [id, updateBoard]
  );

  const deleteBoardHandler = useCallback(async () => {
    if (!id) return;

    try {
      await deleteBoard({ id });
    } catch (error) {}
  }, [deleteBoard, id]);

  const archiveBoardHandler = useCallback(async () => {
    if (!id) return;

    try {
      await archiveBoard({ id });
    } catch (error) {}
  }, [archiveBoard, id]);

  return (
    <BoardSettingsScreen
      updateBoardAction={{
        action: updateBoardHandler,
        isPending: usUpdateBoardLoading,
      }}
      onDeleteBoard={deleteBoardHandler}
      onArchiveBoard={archiveBoardHandler}
      board={{ data: board, isLoading: isBoardLoading }}
    />
  );
};
