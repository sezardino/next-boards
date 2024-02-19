import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const BOARD_BASE_DATA_QUERY_KEY = "boardBaseData";

export const useBoardBaseDataQuery = (id?: string) =>
  useQuery({
    queryKey: [BOARD_BASE_DATA_QUERY_KEY, id],
    queryFn: () => apiService.board.baseData(id!),
    enabled: !!id,
  });
