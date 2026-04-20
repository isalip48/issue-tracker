import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api/users";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });
