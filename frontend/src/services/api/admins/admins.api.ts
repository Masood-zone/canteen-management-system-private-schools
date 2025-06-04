import { apiClient } from "@/services/root";

// Fetch all admins
export const fetchAdmins = async () => {
  const response = await apiClient.get("/admins");
  return response.data;
};

// Fetch admin by id
export const fetchAdmin = async (id: number) => {
  const response = await apiClient.get(`/admins/${id}`);
  return response.data;
};

// Create admin
export const createAdmin = async (data: Admin) => {
  const response = await apiClient.post("/auth/signup", data);
  return response.data;
};

// Update admin
export const updateAdmin = async (data: Admin) => {
  const response = await apiClient.patch(`/admins/${data.id}`, data);
  return response.data;
};
