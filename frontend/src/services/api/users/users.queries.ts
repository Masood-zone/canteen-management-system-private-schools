import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchUsers, fetchUser, updateUser, deleteUser } from "./users.api";

// All user queries will be moved here

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch users.");
    },
  });
};

export const useFetchUser = (id: number) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch user.");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormUser) => updateUser(data),
    onSuccess: (response) => {
      toast.success("User updated successfully!");
      // Update the user in localStorage after updating
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...existingUser,
        user: {
          ...existingUser.user,
          ...response, // Use the updated user data from the API response
        },
      };
      // Refresh page with updated user data
      window.location.reload();
      // Update localStorage with the new user data
      localStorage.setItem("user", JSON.stringify(updatedUser));
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update user. Please try again.");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete user.");
    },
  });
};
