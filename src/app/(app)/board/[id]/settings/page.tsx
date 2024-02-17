import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board Settings",
  ...NO_INDEX_PAGE,
};

const BoardSettingsPage = () => {
  return <h1>BoardSettingsPage</h1>;
};

export default BoardSettingsPage;
