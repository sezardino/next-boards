import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { SignUpDto } from "@/services/bll/modules/auth/dto";
import { useQueryClient } from "@tanstack/react-query";

export const useSignUpMutation = () => {
  const client = useQueryClient();

  return useMutationHelper({
    mutationFn: (data: SignUpDto) => apiService.auth.signUp(data),
    errorToast: "Error sign up",
    successToast: {
      message: "Success sign up",
      description: "Now, you can sign in!",
    },
    onSuccess: () => client.clear(),
  });
};
