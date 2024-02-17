import { Heading } from "@/components/ui/Heading/Heading";
import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  ...NO_INDEX_PAGE,
};

const SettingsPage = () => {
  return (
    <Heading title={{ tag: "h1", text: "General Settings" }} withDivider />
  );
};

export default SettingsPage;
