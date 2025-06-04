// All auth API calls will be moved here

import { apiClient } from "@/services/root";

export const loginApi = async (data: LoginFormProps) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};
