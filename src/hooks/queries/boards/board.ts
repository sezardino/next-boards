import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const BOARD_QUERY_KEY = "board";

export const useBoardQuery = (id?: string) =>
  useQuery({
    queryKey: [BOARD_QUERY_KEY, id],
    queryFn: () => apiService.board.board(id!),
    enabled: !!id,
  });
