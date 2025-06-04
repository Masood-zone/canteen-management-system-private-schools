import { apiClient } from "@/services/root";

// Fetch all users
export const fetchUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

// Fetch a user by ID
export const fetchUser = async (id: number) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

// Update User
export const updateUser = async (data: FormUser) => {
  const response = await apiClient.patch(`/users/${data.id}`, data);
  return response.data;
};

// Delete a user by ID
export const deleteUser = async (id: number) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
