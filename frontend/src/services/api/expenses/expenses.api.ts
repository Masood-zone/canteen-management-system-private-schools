import { apiClient } from "@/services/root";

// Fetch all expenses
export const fetchExpenses = async (params?: {
  period?: string;
  from?: string;
  to?: string;
}) => {
  let url = "/expenses";
  if (params) {
    const search = new URLSearchParams();
    if (params.period) search.set("period", params.period);
    if (params.from) search.set("from", params.from);
    if (params.to) search.set("to", params.to);
    url += `?${search.toString()}`;
  }
  const response = await apiClient.get(url);
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
