import { apiClient } from "@/services/root";

// Fetch all expenses
export const fetchExpenses = async () => {
  const response = await apiClient.get("/expenses");
  return response.data;
};

// Fetch expense by id
export const fetchExpense = async (id: number) => {
  const response = await apiClient.get(`/expenses/${id}`);
  return response.data;
};

// Create a new expense
export const createExpense = async (data: Expense) => {
  const response = await apiClient.post("/expenses", data);
  return response.data;
};

// Update an expense
export const updateExpense = async (data: Expense) => {
  const response = await apiClient.put(`/expenses/${data.id}`, data);
  return response.data;
};
