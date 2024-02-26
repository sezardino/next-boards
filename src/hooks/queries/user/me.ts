import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const ME_QUERY_KEY = "me";

export const useMeQuery = () => {
  // TODO: when error, logout

  return useQuery({
    queryKey: [ME_QUERY_KEY],
    queryFn: () => apiService.user.me(),
  });
};
