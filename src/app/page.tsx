"use client";

import { HomeScreen } from "@/components/screens/Home/HomeScreen";
import { useDataOnPage } from "@/hooks/use-data-on-page";

const HomePage = () => {
  const { search, onSearchChange } = useDataOnPage();

  return <HomeScreen search={search} onSearchChange={onSearchChange} />;
};

export default HomePage;
