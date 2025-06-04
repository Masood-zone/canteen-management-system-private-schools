import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAllOwingStudents,
  fetchTeacherOwingStudents,
  fetchTeacherClassStudents,
  fetchStudentOwingDetails,
  payStudentOwing,
} from "./owing.api";

// Query: Fetch all owing students (admin)
export const useFetchAllOwingStudents = () => {
  return useQuery({
    queryKey: ["owingStudents"],
    queryFn: fetchAllOwingStudents,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch owing students.");
    },
  });
};

// Query: Fetch owing students in teacher's class
export const useFetchTeacherOwingStudents = (teacherId: number) => {
  return useQuery({
    queryKey: ["teacherOwingStudents", teacherId],
    queryFn: () => fetchTeacherOwingStudents(teacherId),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch owing students.");
    },
  });
};

// Query: Fetch students in teacher's class
export const useFetchTeacherClassStudents = (teacherId: number) => {
  return useQuery({
    queryKey: ["teacherClassStudents", teacherId],
    queryFn: () => fetchTeacherClassStudents(teacherId),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch students in class.");
    },
  });
};

// Query: Fetch student owing details
export const useFetchStudentOwingDetails = (studentId: number) => {
  return useQuery({
    queryKey: ["studentOwingDetails", studentId],
    queryFn: () => fetchStudentOwingDetails(studentId),
    enabled: !!studentId,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch student owing details.");
    },
  });
};

// Mutation: Pay student owing
export const usePayStudentOwing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      studentId,
      amount,
    }: {
      studentId: number;
      amount: number;
    }) => payStudentOwing(studentId, amount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teacherOwingStudents"] });
      queryClient.invalidateQueries({ queryKey: ["owingStudents"] });
      queryClient.invalidateQueries({
        queryKey: ["studentOwingDetails", data.student?.id],
      });
      toast.success("Payment processed successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to process payment. Please try again.");
    },
  });
};
