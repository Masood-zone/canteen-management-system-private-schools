import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAdminAnalytics, fetchTeacherAnalytics } from "./analytics.api";

// Query: Admin's Analytics
export const useAdminDashboardAnalytics = () => {
  return useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: fetchAdminAnalytics,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch admin analytics.");
    },
  });
};

// Query: Teacher's Analytics
export const useTeacherAnalytics = (id: number) => {
  return useQuery({
    queryKey: ["teacherAnalytics", id],
    queryFn: () => fetchTeacherAnalytics(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch teacher analytics.");
    },
  });
};
