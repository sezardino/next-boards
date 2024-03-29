import { BOARD_QUERY_KEY } from "@/hooks/queries/boards/board";
import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { UpdateTaskDto } from "@/services/bll/modules/task/dto";

export const useUpdateTaskMutation = () =>
  useMutationHelper({
    mutationFn: (values: UpdateTaskDto) => apiService.task.update(values),
    getQueriesToInvalidate: ({ vars }) => [[BOARD_QUERY_KEY, vars.boardId]],
  });
