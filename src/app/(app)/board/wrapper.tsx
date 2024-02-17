"use client";

import { BoardsScreen } from "@/components/screens/Boards/BoardsScreen";
import { useCreateBoardMutation } from "@/hooks/mutations/board/create";
import { useAllBoardsQuery } from "@/hooks/queries/boards/all";
import { useDataOnPage } from "@/hooks/use-data-on-page";
import { EntityStatusWithoutDeleted } from "@/types";
import { EntityStatus } from "@prisma/client";
import { useState } from "react";

export const BoardsPageWrapper = () => {
  const { search, onSearchChange, changeHandler } = useDataOnPage();
  const { mutateAsync: createBoard, isPending: isCreteBoardPending } =
    useCreateBoardMutation();

  const [statusFilter, onStatusFilterChange] =
    useState<EntityStatusWithoutDeleted>(EntityStatus.ACTIVE);

  const { data: boards, isFetching: isBoardsLoading } = useAllBoardsQuery({
    search,
    status: statusFilter,
  });

  return (
    <BoardsScreen
      search={search}
      onSearchChange={onSearchChange}
      createBoardAction={{
        action: createBoard,
        isPending: isCreteBoardPending,
      }}
      boards={{
        data: boards?.boards,
        isLoading: isBoardsLoading,
      }}
      statusFilter={statusFilter}
      onStatusFilterChange={(status) =>
        changeHandler(status, onStatusFilterChange)
      }
    />
  );
};
