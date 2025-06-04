import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchClasses,
  fetchClass,
  createClass,
  updateClass,
} from "./classes.api";
import { useNavigate } from "react-router-dom";

// Query: Fetch all classes
export const useFetchClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch classes.");
    },
  });
};

// Query: Fetch class by id
export const useFetchClassById = (id: number) => {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: () => fetchClass(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch class.");
    },
  });
};

// Mutation: Create a new class
export const useCreateClass = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      toast.success("Class created successfully!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      navigate("/admin/classes");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create class. Please try again.");
    },
  });
};

// Mutation: Update a class
export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateClass,
    onSuccess: () => {
      toast.success("Class updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      navigate("/admin/classes");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update class. Please try again.");
    },
  });
};
