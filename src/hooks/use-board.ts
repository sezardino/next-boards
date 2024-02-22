import { Board } from "@/services/bll/modules/board/dto";
import { useMemo, useState } from "react";
import { useWatchEffect } from "./use-watch-effect";

export const useBoard = (board?: Board) => {
  const [columns, setColumns] = useState(board?.columns || []);

  const columnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  useWatchEffect(() => {
    if (!board) return;

    setColumns(board.columns);
  }, [board?.columns]);

  return [columns, setColumns, { columnIds }] as const;
};
