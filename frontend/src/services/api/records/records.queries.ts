import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchRecords,
  fetchDashboardSummary,
  fetchRecordsByClassAndDate,
  generateRecordForADate,
  submitTeacherRecord,
  getTeacherSubmittedRecords,
  getTeacherRecords,
  getStudentRecordsByClassAndDate,
  updateStudentStatus,
  bulkUpdateStudentStatus,
} from "./records.api";

// Query: Fetch all records
export const useFetchRecords = () => {
  return useQuery({
    queryKey: ["records"],
    queryFn: fetchRecords,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch records.");
    },
  });
};

// Query: Fetch dashboard summary
export const useFetchDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch records.");
    },
  });
};

// Query: Fetch records by class and date
export const useFetchRecordsByClassAndDate = (
  classId: number,
  date: string
) => {
  return useQuery({
    queryKey: ["records", classId, date],
    queryFn: () => fetchRecordsByClassAndDate(classId, date),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch records.");
    },
  });
};

// Mutation: Generate student records
export const useGenerateStudentRecords = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { classId: number; date: string }) =>
      generateRecordForADate(data.classId, data.date),
    onSuccess: () => {
      toast.success(`Records generated successfully!`);
      queryClient.invalidateQueries({ queryKey: ["studentRecords"] });
      queryClient.invalidateQueries({ queryKey: ["teacherRecords"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to generate records.");
    },
  });
};

// Mutation: Submit teacher record
export const useSubmitTeacherRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitTeacherRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentRecords"] });
      queryClient.invalidateQueries({ queryKey: ["teacherRecords"] });
      toast.success("Records submitted successfully.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to submit records.");
    },
  });
};

// Query: Teacher submitted records
export const useTeacherSubmittedRecords = (teacherId: number, date: string) => {
  return useQuery({
    queryKey: ["submittedRecords", teacherId, date],
    queryFn: () => getTeacherSubmittedRecords(teacherId, date),
    enabled: !!teacherId && !!date,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch submitted records.");
    },
  });
};

// Query: Teacher records
export const useTeacherRecords = (date: string) => {
  return useQuery({
    queryKey: ["teacherRecords", date],
    queryFn: () => getTeacherRecords(date),
    enabled: !!date,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch submitted records.");
    },
  });
};

// Query: Student records by class and date
export const useStudentRecordsByClassAndDate = (
  classId: number,
  date: string
) => {
  return useQuery({
    queryKey: ["studentRecords", classId, date],
    queryFn: () => getStudentRecordsByClassAndDate(classId, date),
    enabled: !!classId && !!date,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch student records.");
    },
  });
};

// Mutation: Update student status
export const useUpdateStudentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentStatus,
    onSuccess: () => {
      toast.success("Record submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["studentRecords"] });
      queryClient.invalidateQueries({ queryKey: ["teacherRecords"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to submit record.");
    },
  });
};

// Mutation: Bulk update student status
export const useBulkUpdateStudentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkUpdateStudentStatus,
    onSuccess: () => {
      toast.success("Records updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["studentRecords"] });
      queryClient.invalidateQueries({ queryKey: ["teacherRecords"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update records.");
    },
  });
};
