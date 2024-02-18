import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { UserSecuritySettingsDto } from "@/services/bll/modules/user/dto";

export const useSecuritySettingsMutation = () =>
  useMutationHelper({
    mutationFn: (dto: UserSecuritySettingsDto) =>
      apiService.user.securitySettings(dto),
    successToast: {
      message: "Security settings updated",
      description: "Your security settings have been updated successfully",
    },
  });
