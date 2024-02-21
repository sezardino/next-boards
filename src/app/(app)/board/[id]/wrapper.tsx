"use client";

import { BoardScreen } from "@/components/screens/Board/BoardScreen";
import { useAddColumnMutation } from "@/hooks/mutations/board/add-column";
import { useAddTaskMutation } from "@/hooks/mutations/board/add-task";
import { useBoardQuery } from "@/hooks/queries/boards/board";

type Props = { params: { id: string } };

export const BoardPageWrapper = (props: Props) => {
  const { id } = props.params;

  const { data: board, isFetching: isBoardLoading } = useBoardQuery(id);

  const { mutateAsync: addColumn, isPending: isAddColumnPending } =
    useAddColumnMutation();
  const { mutateAsync: addTask, isPending: isAddTaskPending } =
    useAddTaskMutation();

  return (
    <BoardScreen
      boardId={id}
      board={{ data: board, isLoading: isBoardLoading }}
      addColumnAction={{
        action: addColumn,
        isPending: isAddColumnPending,
      }}
      addTaskAction={{
        action: addTask,
        isPending: isAddTaskPending,
      }}
    />
  );
};
