import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  fetchPrepayments,
  fetchPrepayment,
  fetchPrepaymentsByStudent,
  fetchActivePrepaymentsByStudent,
  fetchPrepaymentsByClass,
  fetchActivePrepaymentsByClass,
  fetchClassPrepaymentStatus,
  checkStudentPrepayment,
  createPrepayment,
  updatePrepayment,
  deactivatePrepayment,
  deletePrepayment,
  cleanupExpiredPrepayments,
  type UpdatePrepaymentData,
} from "./prepayments.api"

// Queries
export const useFetchPrepayments = () => {
  return useQuery({
    queryKey: ["prepayments"],
    queryFn: fetchPrepayments,
    onError: (error) => {
      console.error(error)
      toast.error("Failed to fetch prepayments.")
    },
  })
}

export const useFetchPrepayment = (id: number) => {
  return useQuery({
    queryKey: ["prepayments", id],
    queryFn: () => fetchPrepayment(id),
    enabled: !!id,
    onError: (error) => {
      console.error(error)
      toast.error("Failed to fetch prepayment.")
    },
  })
}

export const useFetchPrepaymentsByStudent = (studentId: number) => {
  return useQuery({
    queryKey: ["prepayments", "student", studentId],
    queryFn: () => fetchPrepaymentsByStudent(studentId),
    enabled: !!studentId,
    onError: (error) => {
      console.error(error)
      toast.error("Failed to fetch student prepayments.")
    },
  })
}

export const useFetchActivePrepaymentsByStudent = (studentId: number) => {
  return useQuery({
    queryKey: ["prepayments", "student", studentId, "active"],
    queryFn: () => fetchActivePrepaymentsByStudent(studentId),
    enabled: !!studentId,
    onError: (error) => {
      console.error(error)
      toast.error("Failed to fetch active student prepayments.")
    },
  })
}

export const useFetchPrepaymentsByClass = (classId: number) => {
  return useQuery({
    queryKey: ["prepayments", "class", classId],
    queryFn: () => fetchPrepaymentsByClass(classId),
    enabled: !!classId,
    onError: (error) => {
      console.error(error)
      toast.error("Failed to fetch class prepayments.")
    },
  })
}

export const useFetchActivePrepaymentsByClass = (classId: number) => {
  return useQuery({
    queryKey: ["prepayments", "class", classId, "active"],
    queryFn: () => fetchActivePrepaymentsByClass(classId),
    enabled: !!classId,
    onError: (error) => {
      console.error(error)
      toast.error("Failed to fetch active class prepayments.")
    },
  })
}

export const useFetchClassPrepaymentStatus = (classId: number, date?: string) => {
  return useQuery({
    queryKey: ["prepayments", "class", classId, "status", date],
    queryFn: () => fetchClassPrepaymentStatus(classId, date),
    enabled: !!classId,
    onError: (error) => {
      console.error(error)
      toast.error("Failed to fetch class prepayment status.")
    },
  })
}

export const useCheckStudentPrepayment = (studentId: number, date?: string) => {
  return useQuery({
    queryKey: ["prepayments", "student", studentId, "check", date],
    queryFn: () => checkStudentPrepayment(studentId, date),
    enabled: !!studentId,
    onError: (error) => {
      console.error(error)
      toast.error("Failed to check student prepayment status.")
    },
  })
}

// Mutations
export const useCreatePrepayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPrepayment,
    onSuccess: () => {
      toast.success("Prepayment created successfully!")
      queryClient.invalidateQueries({ queryKey: ["prepayments"] })
    },
    onError: (error: any) => {
      console.error(error)
      const message = error?.response?.data?.message || "Failed to create prepayment."
      toast.error(message)
    },
  })
}

export const useUpdatePrepayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePrepaymentData }) => updatePrepayment(id, data),
    onSuccess: () => {
      toast.success("Prepayment updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["prepayments"] })
    },
    onError: (error: any) => {
      console.error(error)
      const message = error?.response?.data?.message || "Failed to update prepayment."
      toast.error(message)
    },
  })
}

export const useDeactivatePrepayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deactivatePrepayment,
    onSuccess: () => {
      toast.success("Prepayment deactivated successfully!")
      queryClient.invalidateQueries({ queryKey: ["prepayments"] })
    },
    onError: (error: any) => {
      console.error(error)
      const message = error?.response?.data?.message || "Failed to deactivate prepayment."
      toast.error(message)
    },
  })
}

export const useDeletePrepayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePrepayment,
    onSuccess: () => {
      toast.success("Prepayment deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["prepayments"] })
    },
    onError: (error: any) => {
      console.error(error)
      const message = error?.response?.data?.message || "Failed to delete prepayment."
      toast.error(message)
    },
  })
}

export const useCleanupExpiredPrepayments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cleanupExpiredPrepayments,
    onSuccess: (data) => {
      if (data.deactivatedCount > 0) {
        toast.success(`${data.deactivatedCount} expired prepayments cleaned up successfully!`)
      } else {
        toast.info("No expired prepayments found.")
      }
      queryClient.invalidateQueries({ queryKey: ["prepayments"] })
    },
    onError: (error: any) => {
      console.error(error)
      const message = error?.response?.data?.message || "Failed to cleanup expired prepayments."
      toast.error(message)
    },
  })
}
