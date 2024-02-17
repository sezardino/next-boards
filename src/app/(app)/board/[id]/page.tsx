import { Heading } from "@/components/ui/Heading/Heading";
import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board",
  ...NO_INDEX_PAGE,
};

const BoardPage = () => {
  return <Heading title={{ tag: "h1", text: "BoardPage" }} withDivider />;
};

export default BoardPage;
