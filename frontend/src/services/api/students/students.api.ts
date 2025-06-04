import { apiClient } from "@/services/root";

// All student API calls will be moved here

export const fetchStudents = async () => {
  const response = await apiClient.get("/students");
  return response.data;
};

export const fetchStudent = async (id: number) => {
  const response = await apiClient.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (data: Student) => {
  const response = await apiClient.post("/students", data);
  return response.data;
};

export const updateStudent = async (data: Student) => {
  const response = await apiClient.put(`/students/${data.id}`, data);
  return response.data;
};

export const deleteStudent = async (id: number) => {
  const response = await apiClient.delete(`/students/${id}`);
  return response.data;
};

export const fetchStudentsInClass = async (id: number) => {
  const response = await apiClient.get(`/students/class/${id}`);
  return response.data;
};

// Fetch owing students by class
export const fetchOwingStudentsByClass = async (classId?: number) => {
  if (classId !== undefined) {
    const response = await apiClient.get(`/students/class/${classId}/owing`);
    return response.data;
  } else {
    const response = await apiClient.get("/admins/owing-students");
    return response.data;
  }
};
