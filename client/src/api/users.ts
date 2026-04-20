import api from "./axios";
import type { User } from "@/types";

interface UserResponse {
  succes: boolean;
  data: { users: User[] };
}

export const usersApi = {
  getAll: async (): Promise<UserResponse> => {
    const { data } = await api.get<UserResponse>("/users");
    return data;
  },
};
