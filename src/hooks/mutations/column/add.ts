import { BOARD_VIEW_QUERY_KEY } from "@/hooks/queries/boards/view";
import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { AddColumnDto } from "@/services/bll/modules/column/dto";

export const useAddColumnMutation = () =>
  useMutationHelper({
    mutationFn: (values: AddColumnDto) => apiService.column.add(values),
    getQueriesToInvalidate: ({ vars }) => [
      [BOARD_VIEW_QUERY_KEY, vars.boardId],
    ],
  });
