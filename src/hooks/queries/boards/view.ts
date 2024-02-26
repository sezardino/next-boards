import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const BOARD_VIEW_QUERY_KEY = "board";

export const useBoardViewQuery = (id?: string) =>
  useQuery({
    queryKey: [BOARD_VIEW_QUERY_KEY, id],
    queryFn: () => apiService.board.view(id!),
    enabled: !!id,
  });
