import { Heading } from "@/components/ui/Heading/Heading";
import { NO_INDEX_PAGE } from "@/const";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  ...NO_INDEX_PAGE,
};

const HomePage = () => {
  return <Heading title={{ tag: "h1", text: "HomePage" }} withDivider />;
};

export default HomePage;
