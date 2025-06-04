import { apiClient } from "@/services/root";

// All teacher API calls will be moved here

export const fetchTeachers = async () => {
  const response = await apiClient.get("/teachers");
  return response.data.teachers;
};

export const fetchTeacher = async (id: number) => {
  const response = await apiClient.get(`/teachers/${id}`);
  return response.data;
};

export const createTeacher = async (data: Teacher) => {
  const response = await apiClient.post("/auth/signup", data);
  return response.data;
};

export const updateTeacher = async (data: Teacher) => {
  const response = await apiClient.patch(`/teachers/${data.id}`, data);
  return response.data;
};

export const deleteTeacher = async (id: number) => {
  const response = await apiClient.delete(`/teachers/${id}`);
  return response.data;
};

// Fetch teacher records detail by date
export const fetchTeacherRecordsDetail = async (date: Date) => {
  const response = await apiClient.get("/records/teachers", {
    params: {
      date: date.toISOString(),
    },
  });
  return response.data;
};
