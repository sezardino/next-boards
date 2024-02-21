"use client";

import { BoardScreen } from "@/components/screens/Board/BoardScreen";
import { useAddColumnMutation } from "@/hooks/mutations/board/add-column";
import { useAddTaskMutation } from "@/hooks/mutations/board/add-task";
import { useBoardQuery } from "@/hooks/queries/boards/board";
import { AddTaskDto } from "@/services/bll/modules/board/dto";
import { useCallback } from "react";

type Props = { params: { id: string } };

export const BoardPageWrapper = (props: Props) => {
  const { id } = props.params;

  const { data: board, isFetching: isBoardLoading } = useBoardQuery(id);

  const { mutateAsync: addColumn, isPending: isAddColumnPending } =
    useAddColumnMutation();
  const { mutateAsync: addTask, isPending: isAddTaskPending } =
    useAddTaskMutation();

  const addColumnHelper = useCallback(
    async (title: string) => addColumn({ title, boardId: id }),
    [addColumn, id]
  );

  const addTaskHelper = useCallback(
    async (dto: Omit<AddTaskDto, "boardId">) =>
      addTask({ ...dto, boardId: id }),
    [addTask, id]
  );

  if (board && "error" in board) return null;

  return (
    <BoardScreen
      boardId={id}
      board={{ data: board, isLoading: isBoardLoading }}
      addColumnAction={{
        action: addColumnHelper,
        isPending: isAddColumnPending,
      }}
      addTaskAction={{
        action: addTaskHelper,
        isPending: isAddTaskPending,
      }}
    />
  );
};
