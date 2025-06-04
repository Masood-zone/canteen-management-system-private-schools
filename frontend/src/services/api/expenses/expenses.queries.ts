import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchExpenses,
  fetchExpense,
  createExpense,
  updateExpense,
} from "./expenses.api";
import { useNavigate } from "react-router-dom";

// Query: Fetch all expenses
export const useFetchExpenses = (filter?: {
  period?: string;
  from?: string;
  to?: string;
}) => {
  return useQuery({
    queryKey: ["expenses", filter],
    queryFn: () => fetchExpenses(filter),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch expenses.");
    },
  });
};

// Query: Fetch expense by id
export const useFetchExpense = (id: number) => {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => fetchExpense(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch expense.");
    },
  });
};

// Mutation: Create a new expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense created successfully!");
      navigate("/admin/accounts");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create expense. Please try again.");
    },
  });
};

// Mutation: Update an expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense updated successfully!");
      navigate("/admin/expenses");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update expense. Please try again.");
    },
  });
};
