import { apiClient } from "@/services/root"

export interface CreatePrepaymentData {
  studentId: number
  classId: number
  amount: number
  durationType: "days" | "weeks" | "months"
  durationValue: number
  startDate: string
}

export interface UpdatePrepaymentData {
  amount?: number
  durationType?: "days" | "weeks" | "months"
  durationValue?: number
  startDate?: string
  isActive?: boolean
}

export interface Prepayment {
  id: number
  studentId: number
  classId: number
  amount: number
  durationType: string
  durationValue: number
  startDate: string
  endDate: string
  isActive: boolean
  createdBy: number
  createdAt: string
  updatedAt: string
  student: {
    id: number
    name: string
    age: number
    parentPhone?: string
    gender?: string
  }
  class: {
    id: number
    name: string
    description?: string
  }
  creator: {
    id: number
    name: string
    email: string
  }
}

export interface PrepaymentStatus {
  studentId: number
  studentName: string
  prepaymentId: number
  amount: number
  startDate: string
  endDate: string
  durationType: string
  durationValue: number
  isActive: boolean
}

// Get all prepayments
export const fetchPrepayments = async (): Promise<Prepayment[]> => {
  const response = await apiClient.get("/prepayments")
  return response.data
}

// Get prepayment by ID
export const fetchPrepayment = async (id: number): Promise<Prepayment> => {
  const response = await apiClient.get(`/prepayments/${id}`)
  return response.data
}

// Get prepayments by student ID
export const fetchPrepaymentsByStudent = async (studentId: number): Promise<Prepayment[]> => {
  const response = await apiClient.get(`/prepayments/student/${studentId}`)
  return response.data
}

// Get active prepayments by student ID
export const fetchActivePrepaymentsByStudent = async (studentId: number): Promise<Prepayment[]> => {
  const response = await apiClient.get(`/prepayments/student/${studentId}/active`)
  return response.data
}

// Get prepayments by class ID
export const fetchPrepaymentsByClass = async (classId: number): Promise<Prepayment[]> => {
  const response = await apiClient.get(`/prepayments/class/${classId}`)
  return response.data
}

// Get active prepayments by class ID
export const fetchActivePrepaymentsByClass = async (classId: number): Promise<Prepayment[]> => {
  const response = await apiClient.get(`/prepayments/class/${classId}/active`)
  return response.data
}

// Get class prepayment status for a specific date
export const fetchClassPrepaymentStatus = async (classId: number, date?: string): Promise<PrepaymentStatus[]> => {
  const params = date ? `?date=${date}` : ""
  const response = await apiClient.get(`/prepayments/class/${classId}/status${params}`)
  return response.data
}

// Check if student has active prepayment
export const checkStudentPrepayment = async (
  studentId: number,
  date?: string,
): Promise<{ hasActivePrepayment: boolean }> => {
  const params = date ? `?date=${date}` : ""
  const response = await apiClient.get(`/prepayments/student/${studentId}/check${params}`)
  return response.data
}

// Create prepayment
export const createPrepayment = async (data: CreatePrepaymentData): Promise<Prepayment> => {
  const response = await apiClient.post("/prepayments", data)
  return response.data
}

// Update prepayment
export const updatePrepayment = async (id: number, data: UpdatePrepaymentData): Promise<Prepayment> => {
  const response = await apiClient.put(`/prepayments/${id}`, data)
  return response.data
}

// Deactivate prepayment
export const deactivatePrepayment = async (id: number): Promise<Prepayment> => {
  const response = await apiClient.patch(`/prepayments/${id}/deactivate`)
  return response.data
}

// Delete prepayment
export const deletePrepayment = async (id: number): Promise<void> => {
  await apiClient.delete(`/prepayments/${id}`)
}

// Cleanup expired prepayments
export const cleanupExpiredPrepayments = async (): Promise<{ deactivatedCount: number }> => {
  const response = await apiClient.post("/prepayments/cleanup-expired")
  return response.data
}
