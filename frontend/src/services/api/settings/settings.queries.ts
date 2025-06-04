import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchRecordsAmount,
  getPresetAmount,
  createRecordsAmount,
  updateRecordsAmount,
} from "./settings.api";

// Query: Fetch records amount
export const useFetchRecordsAmount = () => {
  return useQuery({
    queryKey: ["recordsAmount"],
    queryFn: fetchRecordsAmount,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch records amount.");
    },
  });
};

// Query: Get preset amount
export const useGetPresetAmount = () => {
  return useQuery({
    queryKey: ["presetAmount"],
    queryFn: getPresetAmount,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch preset amount.");
    },
  });
};

// Mutation: Create settings amount
export const useCreateRecordsAmount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecordsAmount,
    onSuccess: () => {
      toast.success("Preset amount created successfully!");
      queryClient.invalidateQueries({ queryKey: ["records"] });
      queryClient.invalidateQueries({ queryKey: ["recordsAmount"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create preset amount.");
    },
  });
};

// Mutation: Update settings amount
export const useUpdateRecordsAmount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRecordsAmount,
    onSuccess: () => {
      toast.success("Preset amount updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["records"] });
      queryClient.invalidateQueries({ queryKey: ["recordsAmount"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update preset amount.");
    },
  });
};
