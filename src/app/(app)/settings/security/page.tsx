import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";
import { SettingsSecurityPageWrapper } from "./wrapper";

export const metadata: Metadata = {
  title: "Settings Security",
  ...NO_INDEX_PAGE,
};

export default SettingsSecurityPageWrapper;
