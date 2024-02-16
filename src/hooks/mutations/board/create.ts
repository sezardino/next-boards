import { ALL_BOARDS_QUERY_KEY } from "@/hooks/queries/boards/all";
import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { CreateBoardDto } from "@/services/bll/modules/board/dto";

export const useCreateBoardMutation = () =>
  useMutationHelper({
    mutationFn: (values: CreateBoardDto) => apiService.board.create(values),
    getQueriesToInvalidate: () => [[ALL_BOARDS_QUERY_KEY]],
  });
