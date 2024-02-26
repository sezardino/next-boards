import { ME_QUERY_KEY } from "@/hooks/queries/user/me";
import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { UserGeneralSettingsDto } from "@/services/bll/modules/user/dto";

export const useGeneralSettingsMutation = () =>
  useMutationHelper({
    mutationFn: (dto: UserGeneralSettingsDto) =>
      apiService.user.generalSettings(dto),
    successToast: {
      message: "General settings updated",
      description: "Your general settings have been updated successfully",
    },
    errorToast: "Failed to update general settings",
    getQueriesToInvalidate: () => [[ME_QUERY_KEY]],
  });
