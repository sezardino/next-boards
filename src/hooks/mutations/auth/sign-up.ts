import { useMutationHelper } from "@/lib/react-query";
import { apiService } from "@/services/api";
import { SignUpRequest } from "@/services/bll/modules/auth/dto";
import { useQueryClient } from "@tanstack/react-query";

export const useSignUpMutation = () => {
  const client = useQueryClient();

  return useMutationHelper({
    mutationFn: (data: SignUpRequest) => apiService.auth.signUp(data),
    errorToast: {
      message: "Error sign up",
      description: "Something went wrong",
    },
    successToast: {
      message: "Success sign up",
      description: "Now, you can sign in!",
    },
    onSuccess: () => client.clear(),
  });
};
