import { BOARD_BASE_DATA_QUERY_KEY } from "@/hooks/queries/boards/base-data";
import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { PatchBoardBaseDataDto } from "@/services/bll/modules/board/dto/update-base-data";

export const useBoardBaseDataMutation = () =>
  useMutationHelper({
    mutationFn: (dto: PatchBoardBaseDataDto) =>
      apiService.board.updateBaseData(dto),
    getQueriesToInvalidate: ({ vars }) => [
      [BOARD_BASE_DATA_QUERY_KEY, vars.id],
    ],
    successToast: {
      message: "Success!",
      description: "Board data has been updated successfully",
    },
    errorToast: "Error",
  });
