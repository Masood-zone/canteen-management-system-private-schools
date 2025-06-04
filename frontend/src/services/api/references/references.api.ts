import { apiClient } from "@/services/root";

// Fetch all references
export const fetchReferences = async () => {
  const response = await apiClient.get("/references");
  return response.data;
};

// Fetch reference by id
export const fetchReference = async (id: number) => {
  const response = await apiClient.get(`/references/${id}`);
  return response.data;
};

// Create a new reference
export const createReference = async (data: Reference) => {
  const response = await apiClient.post("/references", data);
  return response.data;
};

// Update a reference
export const updateReference = async (data: Reference) => {
  const response = await apiClient.put(`/references/${data.id}`, data);
  return response.data;
};
