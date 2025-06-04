import { apiClient } from "@/services/root";

// Fetch all owing students (admin)
export const fetchAllOwingStudents = async () => {
  const response = await apiClient.get("/admins/owing-students");
  return response.data;
};

// Fetch owing students in teacher's class
export const fetchTeacherOwingStudents = async (teacherId: number) => {
  const response = await apiClient.get(`/teachers/${teacherId}/owing-students`);
  return response.data;
};

// Fetch students in teacher's class (returns only students array)
export const fetchTeacherClassStudents = async (teacherId: number) => {
  const response = await apiClient.get(`/teachers/${teacherId}/owing-students`);
  return response.data.owingStudents;
};

// Fetch student owing details
export const fetchStudentOwingDetails = async (studentId: number) => {
  const response = await apiClient.get(`/students/${studentId}/owing`);
  return response.data;
};

// Pay student owing
export const payStudentOwing = async (studentId: number, amount: number) => {
  const response = await apiClient.post(`/students/${studentId}/pay`, {
    amount,
  });
  return response.data;
};
