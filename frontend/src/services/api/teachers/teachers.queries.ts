import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchTeachers,
  fetchTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  fetchTeacherRecordsDetail,
} from "./teachers.api";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/services/root";

export const useFetchTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch teachers.");
    },
  });
};

export const useFetchTeacher = (id: number) => {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => fetchTeacher(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch teacher.");
    },
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      toast.success("Teacher created successfully!");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      navigate("/admin/teachers");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create teacher. Please try again.");
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      toast.success("Teacher updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      navigate("/admin/teachers");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update teacher. Please try again.");
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      toast.success("Teacher deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete teacher.");
    },
  });
};

export const useFetchTeacherRecordsDetail = (date: Date) => {
  return useQuery({
    queryKey: ["teacherRecordsDetail", date],
    queryFn: () => fetchTeacherRecordsDetail(date),
    onError: (error) => {
      console.error(error);
      // Optionally show a toast or handle error
    },
  });
};

export const useResetTeacherPassword = () => {
  return useMutation({
    mutationFn: async ({ id, password }: { id: number; password: string }) => {
      const response = await apiClient.post(`/teachers/${id}/reset-password`, {
        password,
      });
      return response.data;
    },
  });
};
