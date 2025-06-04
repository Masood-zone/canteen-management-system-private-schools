import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchReferences,
  fetchReference,
  createReference,
  updateReference,
} from "./references.api";

// Query: Fetch all references
export const useFetchReferences = () => {
  return useQuery({
    queryKey: ["references"],
    queryFn: fetchReferences,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch references.");
    },
  });
};

// Query: Fetch reference by id
export const useFetchReference = (id: number) => {
  return useQuery({
    queryKey: ["references", id],
    queryFn: () => fetchReference(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch reference.");
    },
  });
};

// Mutation: Create a new reference
export const useCreateReference = () => {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();
  return useMutation({
    mutationFn: createReference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["references"] });
      toast.success("Reference created successfully!");
      // navigate("/admin/expenses");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create reference. Please try again.");
    },
  });
};

// Mutation: Update a reference
export const useUpdateReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["references"] });
      toast.success("References updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update reference. Please try again.");
    },
  });
};
