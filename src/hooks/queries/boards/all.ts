import { apiService } from "@/services/api";
import { AllBoardsDto } from "@/services/bll/modules/board/dto";
import { useQuery } from "@tanstack/react-query";

export const ALL_BOARDS_QUERY_KEY = "all-boards";

export const useAllBoardsQuery = (params: AllBoardsDto = {}) =>
  useQuery({
    queryKey: [ALL_BOARDS_QUERY_KEY, ...Object.values(params)],
    queryFn: async () => apiService.board.all(params),
  });
