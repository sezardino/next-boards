"use client";

import { HomeScreen } from "@/components/screens/Home/HomeScreen";
import { useCreateBoardMutation } from "@/hooks/mutations/board/create";
import { useAllBoardsQuery } from "@/hooks/queries/boards/all";
import { useDataOnPage } from "@/hooks/use-data-on-page";
import { EntityStatusWithoutDeleted } from "@/types";
import { EntityStatus } from "@prisma/client";
import { useState } from "react";

const HomePage = () => {
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
    <HomeScreen
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

export default HomePage;
