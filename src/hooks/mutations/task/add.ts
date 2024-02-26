import { BOARD_QUERY_KEY } from "@/hooks/queries/boards/board";
import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { AddTaskDto } from "@/services/bll/modules/task/dto";

export const useAddTaskMutation = () =>
  useMutationHelper({
    mutationFn: (values: AddTaskDto) => apiService.task.add(values),
    getQueriesToInvalidate: ({ vars }) => [[BOARD_QUERY_KEY, vars.boardId]],
  });
