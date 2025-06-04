import { apiClient } from "@/services/root";

// Fetch all records
export const fetchRecords = async () => {
  const response = await apiClient.get("/records");
  return response.data;
};

// Fetch dashboard summary
export const fetchDashboardSummary = async () => {
  const response = await apiClient.get("/records/dashboard-summary");
  return response.data;
};

// Fetch records by class and date
export const fetchRecordsByClassAndDate = async (
  classId: number,
  date: string
) => {
  const response = await apiClient.get(`/records/${classId}?date=${date}`);
  return response.data;
};

// Generate records for a date
export const generateRecordForADate = async (classId: number, date: string) => {
  const response = await apiClient.post(
    `/records/generate-daily?date=${date}`,
    {
      params: { classId },
    }
  );
  return response.data;
};

// Submit teacher record
export const submitTeacherRecord = async (data: SubmitTeacherRecordPayload) => {
  const response = await apiClient.post("/records/submit", data);
  return response.data;
};

// Get teacher submitted records
export const getTeacherSubmittedRecords = async (
  teacherId: number,
  date: string
) => {
  const response = await apiClient.get(
    `/records/teacher/${teacherId}?date=${date}`
  );
  return response.data;
};

// Get teacher records
export const getTeacherRecords = async (dateFormat: string) => {
  const response = await apiClient.get(`/records/teachers?date=${dateFormat}`);
  return response.data;
};

// Get student records by class and date
export const getStudentRecordsByClassAndDate = async (
  classId: number,
  date: string
) => {
  const response = await apiClient.get(`/records/${classId}?date=${date}`);
  return response.data;
};

// Update student status
export const updateStudentStatus = async (data: StudentRecord) => {
  const response = await apiClient.put(`/records/${data?.id}/status`, data);
  return response.data;
};

// Bulk update student status
interface BulkUpdateStudentStatusRecord {
  id: number;
  status?: string;
  // Add other fields as needed
}

interface BulkUpdateStudentStatusResponse {
  success: boolean;
  updatedCount: number;
  // Add other fields as needed
}

export const bulkUpdateStudentStatus = async (
  records: BulkUpdateStudentStatusRecord[]
): Promise<BulkUpdateStudentStatusResponse> => {
  try {
    const response = await apiClient.post<BulkUpdateStudentStatusResponse>(
      "/records/bulk-update-status",
      {
        records,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating student statuses:", error);
    throw error;
  }
};
