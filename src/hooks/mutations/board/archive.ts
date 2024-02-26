import { ALL_BOARDS_QUERY_KEY } from "@/hooks/queries/boards/all";
import { BOARD_VIEW_QUERY_KEY } from "@/hooks/queries/boards/view";
import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { DeleteBoardDto } from "@/services/bll/modules/board/dto/delete";

export const useArchiveBoardMutation = () =>
  useMutationHelper({
    mutationFn: (values: DeleteBoardDto) => apiService.board.archive(values),
    getQueriesToInvalidate: ({ vars }) => [
      [ALL_BOARDS_QUERY_KEY],
      [BOARD_VIEW_QUERY_KEY, vars.id],
    ],
  });
