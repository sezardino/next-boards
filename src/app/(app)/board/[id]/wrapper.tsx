"use client";

import { BoardScreen } from "@/components/screens/Board/BoardScreen";
import { useAddColumnMutation } from "@/hooks/mutations/column/add";
import { useUpdateColumnMutation } from "@/hooks/mutations/column/update";
import { useAddTaskMutation } from "@/hooks/mutations/task/add";
import { useUpdateTaskMutation } from "@/hooks/mutations/task/update";
import { useBoardQuery } from "@/hooks/queries/boards/board";
import { UpdateColumnDto } from "@/services/bll/modules/column/dto";
import { AddTaskDto, UpdateTaskDto } from "@/services/bll/modules/task/dto";
import { useCallback } from "react";

type Props = { params: { id: string } };

export const BoardPageWrapper = (props: Props) => {
  const { id } = props.params;

  const { data: board, isFetching: isBoardLoading } = useBoardQuery(id);

  const { mutateAsync: addColumn, isPending: isAddColumnPending } =
    useAddColumnMutation();
  const { mutateAsync: addTask, isPending: isAddTaskPending } =
    useAddTaskMutation();

  const { mutateAsync: updateColumn, isPending: isUpdateColumnPending } =
    useUpdateColumnMutation();
  const { mutateAsync: updateTask, isPending: isUpdateTaskPending } =
    useUpdateTaskMutation();

  const addColumnHelper = useCallback(
    async (title: string) => addColumn({ title, boardId: id }),
    [addColumn, id]
  );

  const addTaskHelper = useCallback(
    async (dto: Omit<AddTaskDto, "boardId">) =>
      addTask({ ...dto, boardId: id }),
    [addTask, id]
  );

  const updateColumnHandler = useCallback(
    async (dto: Omit<UpdateColumnDto, "boardId">) =>
      updateColumn({ ...dto, boardId: id }),
    [id, updateColumn]
  );

  const updateTaskHandler = useCallback(
    async (dto: Omit<UpdateTaskDto, "boardId">) =>
      updateTask({ ...dto, boardId: id }),
    [id, updateTask]
  );

  if (board && "error" in board) return null;

  return (
    <BoardScreen
      board={{ data: board, isLoading: isBoardLoading }}
      addColumnAction={{
        action: addColumnHelper,
        isPending: isAddColumnPending,
      }}
      addTaskAction={{
        action: addTaskHelper,
        isPending: isAddTaskPending,
      }}
      updateColumnAction={{
        action: updateColumnHandler,
        isPending: isUpdateColumnPending,
      }}
      updateTaskAction={{
        action: updateTaskHandler,
        isPending: isUpdateTaskPending,
      }}
    />
  );
};
