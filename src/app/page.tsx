"use client";

import { HomeScreen } from "@/components/screens/Home/HomeScreen";
import { useCreateBoardMutation } from "@/hooks/mutations/board/create";
import { useDataOnPage } from "@/hooks/use-data-on-page";

const HomePage = () => {
  const { search, onSearchChange } = useDataOnPage();
  const { mutateAsync: createBoard, isPending: isCreteBoardPending } =
    useCreateBoardMutation();

  return (
    <HomeScreen
      search={search}
      onSearchChange={onSearchChange}
      createBoardAction={{
        action: createBoard,
        isPending: isCreteBoardPending,
      }}
    />
  );
};

export default HomePage;
