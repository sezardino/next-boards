import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";
import { SettingsPageWrapper } from "./wrapper";

export const metadata: Metadata = {
  title: "Settings",
  ...NO_INDEX_PAGE,
};

export default SettingsPageWrapper;
