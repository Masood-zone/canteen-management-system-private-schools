import { apiClient } from "@/services/root";

export const fetchAdmin = async (id: number) => {
  const response = await apiClient.get(`/admins/${id}`);
  return response.data;
};
