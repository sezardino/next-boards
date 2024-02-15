import { useState } from "react";

export const useDataOnPage = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const onElseChange = <T>(value: T, setter: (value: T) => void) => {
    setPage(0);
    setter(value);
  };

  const onSearchChange = (value: string) => onElseChange(value, setSearch);

  const onLimitChange = (value: number) => onElseChange(value, setLimit);

  return {
    page,
    onPageChange: setPage,
    limit,
    onLimitChange,
    search,
    onSearchChange,
    changeHandler: onElseChange,
  };
};
