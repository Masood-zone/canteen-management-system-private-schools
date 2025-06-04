import { apiClient } from "@/services/root";

// Fetch canteen amount
export const fetchRecordsAmount = async () => {
  const response = await apiClient.get("/settings/amount");
  return response.data;
};

// Get preset amount
export const getPresetAmount = async () => {
  const response = await apiClient.get("/preset-amount");
  return response.data;
};

// Create settings amount
export const createRecordsAmount = async (data: RecordsAmount) => {
  const response = await apiClient.post("/settings/amount", data);
  return response.data;
};

// Update settings amount
export const updateRecordsAmount = async (data: RecordsAmount) => {
  const response = await apiClient.patch("/settings/amount", data);
  return response.data;
};
