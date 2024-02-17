import { Heading } from "@/components/ui/Heading/Heading";
import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings Security",
  ...NO_INDEX_PAGE,
};

const SettingsSecurityPage = () => {
  return (
    <Heading title={{ tag: "h1", text: "SettingsSecurityPage" }} withDivider />
  );
};

export default SettingsSecurityPage;
