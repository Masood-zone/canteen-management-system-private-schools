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
  return useMutation({
    mutationFn: (data: FormUser) => updateUser(data),
    onSuccess: () => {
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update user. Please try again.");
    },
    onSettled: (data) => {
      // Update the user in localStorage after updating
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...existingUser,
        user: {
          ...existingUser.user,
          email: data?.data.email,
          gender: data?.data.gender,
          name: data?.data.name,
          phone: data?.data.phone,
        },
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
