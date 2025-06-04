import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAdmins,
  fetchAdmin,
  createAdmin,
  updateAdmin,
} from "./admins.api";
import { useNavigate } from "react-router-dom";

// Query: Fetch all admins
export const useFetchAdmins = () => {
  return useQuery({
    queryKey: ["administrators"],
    queryFn: fetchAdmins,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch teachers.");
    },
  });
};

// Query: Fetch admin by id
export const useFetchAdmin = (id: number) => {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: () => fetchAdmin(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch teacher.");
    },
  });
};

// Mutation: Create admin
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      toast.success("Admin created successfully!");
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
      navigate("/admin/administrators");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create admin. Please try again.");
    },
  });
};

// Mutation: Update admin
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      toast.success("Admin updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
      navigate("/admin/administrators");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update admin. Please try again.");
    },
  });
};
