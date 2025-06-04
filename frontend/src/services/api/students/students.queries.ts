import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchStudents,
  fetchStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchStudentsInClass,
  fetchOwingStudentsByClass,
} from "./students.api";
import { useNavigate } from "react-router-dom";

// All student queries will be moved here

export const useFetchStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch students.");
    },
  });
};

export const useFetchStudent = (id: number) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => fetchStudent(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch student.");
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      toast.success("Student created successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate("/admin/students");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create student. Please try again.");
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      toast.success("Student updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate("/admin/students");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update student. Please try again.");
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      toast.success("Student deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete student.");
    },
  });
};

export const useFetchStudentsInClass = (id: number) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => fetchStudentsInClass(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch students in this class.");
    },
  });
};

export const useFetchOwingStudentsByClass = (classId?: number) => {
  return useQuery({
    queryKey: ["owingStudentsByClass", classId],
    queryFn: () => fetchOwingStudentsByClass(classId),
    enabled: classId !== undefined,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch owing students for this class.");
    },
  });
};
