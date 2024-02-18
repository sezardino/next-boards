import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";
import { BoardSettingsPageWrapper } from "./wrapper";

export const metadata: Metadata = {
  title: "Board Settings",
  ...NO_INDEX_PAGE,
};

export default BoardSettingsPageWrapper;
