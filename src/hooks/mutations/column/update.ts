import { BOARD_VIEW_QUERY_KEY } from "@/hooks/queries/boards/view";
import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { UpdateColumnDto } from "@/services/bll/modules/column/dto";

export const useUpdateColumnMutation = () =>
  useMutationHelper({
    mutationFn: (dto: UpdateColumnDto) => apiService.column.update(dto),
    getQueriesToInvalidate: ({ vars }) => [
      [BOARD_VIEW_QUERY_KEY, vars.boardId],
    ],
  });
