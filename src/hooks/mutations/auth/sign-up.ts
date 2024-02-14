import { useMutationHelper } from "@/lib/react-query";
import { SignUpRequest } from "@/services/bll/modules/auth/dto";

export const useSignUpMutation = () =>
  useMutationHelper({
    mutationFn: async (data: SignUpRequest) =>
      fetch("/api/auth/sign-up", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    errorToast: {
      message: "Error sign up",
      description: "Something went wrong",
    },
    successToast: {
      message: "Success sign up",
      description: "Now, you can sign in!",
    },
  });
