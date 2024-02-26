import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const BOARD_INFORMATION_QUERY_KEY = "board-information";

export const useBoardInformationQuery = (id?: string) =>
  useQuery({
    queryKey: [BOARD_INFORMATION_QUERY_KEY, id],
    queryFn: () => apiService.board.information(id!),
    enabled: !!id,
  });
