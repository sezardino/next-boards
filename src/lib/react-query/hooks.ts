import { BllModuleError } from "@/services/bll/utils";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type GetQueriesToInvalidateFunction<
  Var extends unknown,
  Res extends unknown,
  Args extends unknown
> = (args: { res: Res; vars: Var; args?: Args }) => any[][];

type Toast = {
  message: string;
  description?: string;
};

interface UseMutationHelper<
  Var extends unknown,
  Res extends unknown,
  Args extends unknown,
  Err extends AxiosError<BllModuleError>
> extends UseMutationOptions<Res, Err, Var, unknown> {
  getQueriesToInvalidate?: GetQueriesToInvalidateFunction<Var, Res, Args>;
  errorToast?: string | Toast;
  successToast?: Toast;
  args?: Args;
}

export const useMutationHelper = <
  Var extends any,
  Res extends unknown,
  Args extends unknown,
  Err extends AxiosError<BllModuleError>
>(
  props: UseMutationHelper<Var, Res, Args, Err>
) => {
  const {
    mutationFn,
    getQueriesToInvalidate,
    args,
    errorToast,
    successToast,
    onSuccess,
    onError,
    ...rest
  } = props;
  const client = useQueryClient();

  return useMutation({
    ...rest,
    mutationFn: (data: Var) => {
      if (!mutationFn) return Promise.reject("No mutation function provided");

      return mutationFn(data);
    },
    onSuccess: (res, vars, ctx) => {
      if (getQueriesToInvalidate) {
        const queries = getQueriesToInvalidate({ res, vars, args });
        queries
          .filter(Boolean)
          .forEach((query) => client.invalidateQueries({ queryKey: query }));
      }

      if (onSuccess) onSuccess(res, vars, ctx);
      if (successToast)
        toast(
          successToast.message,
          successToast.description
            ? { description: successToast.description }
            : undefined
        );
    },
    onError: (err, vars, ctx) => {
      const response = err.response?.data;
      if (typeof err === "string" && err === "") return;

      if (onError) onError(err, vars, ctx);
      if (typeof errorToast === "string") {
        toast(
          errorToast,
          typeof response?.error ? { description: response?.error } : undefined
        );
      } else if (errorToast) {
        toast(
          errorToast.message,
          errorToast.description
            ? { description: errorToast.description }
            : undefined
        );
      }
    },
  });
};
