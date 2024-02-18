import { BoardScreen } from "@/components/screens/Board/BoardScreen";

export const BoardPageWrapper = ({
  params: { id },
}: {
  params: { id: string };
}) => {
  return <BoardScreen boardId={id} />;
};
