import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";
import { BoardPageWrapper } from "./wrapper";

export const metadata: Metadata = {
  title: "Board",
  ...NO_INDEX_PAGE,
};

export default BoardPageWrapper;
