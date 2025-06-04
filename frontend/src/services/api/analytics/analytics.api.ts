import { apiClient } from "@/services/root";

// Fetch admin analytics
export const fetchAdminAnalytics = async () => {
  const response = await apiClient.get("/analytics/admin-dashboard");
  return response.data;
};

// Fetch teacher analytics
export const fetchTeacherAnalytics = async (classId: number) => {
  const response = await apiClient.get(`/analytics/teachers/${classId}`);
  return response.data;
};
