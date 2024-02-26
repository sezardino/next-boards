import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";
import { BoardsPageWrapper } from "./wrapper";

export const metadata: Metadata = {
  title: "Boards",
  ...NO_INDEX_PAGE,
};

const BoardsPage = () => <BoardsPageWrapper />;

export default BoardsPage;
