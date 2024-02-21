import { BOARD_QUERY_KEY } from "@/hooks/queries/boards/board";
import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { AddColumnDto } from "@/services/bll/modules/column/dto";

export const useAddColumnMutation = () =>
  useMutationHelper({
    mutationFn: (values: AddColumnDto) => apiService.board.addColumn(values),
    getQueriesToInvalidate: ({ vars }) => [[BOARD_QUERY_KEY, vars.boardId]],
  });
