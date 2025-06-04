import { prepaymentRepository } from "../db/repositories/prepayment-repository";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";

export interface CreatePrepaymentData {
  studentId: number;
  classId: number;
  amount: number;
  durationType: "days" | "weeks" | "months";
  durationValue: number;
  startDate: string;
  createdBy: number;
}

export interface UpdatePrepaymentData {
  amount?: number;
  durationType?: "days" | "weeks" | "months";
  durationValue?: number;
  startDate?: string;
  isActive?: boolean;
}

export const prepaymentService = {
  getAllPrepayments: async () => {
    return prepaymentRepository.findAll();
  },

  getPrepaymentById: async (id: number) => {
    const prepayment = await prepaymentRepository.findById(id);
    if (!prepayment) {
      throw new ApiError(404, "Prepayment not found");
    }
    return prepayment;
  },

  getPrepaymentsByStudentId: async (studentId: number) => {
    return prepaymentRepository.findByStudentId(studentId);
  },

  getPrepaymentsByClassId: async (classId: number) => {
    return prepaymentRepository.findByClassId(classId);
  },

  getActivePrepaymentsByStudentId: async (studentId: number) => {
    const currentDate = new Date();
    return prepaymentRepository.findActiveByStudentId(studentId, currentDate);
  },

  getActivePrepaymentsByClassId: async (classId: number) => {
    const currentDate = new Date();
    return prepaymentRepository.findActiveByClassId(classId, currentDate);
  },

  createPrepayment: async (data: CreatePrepaymentData) => {
    const {
      studentId,
      classId,
      amount,
      durationType,
      durationValue,
      startDate,
      createdBy,
    } = data;

    // Validate input
    if (amount <= 0) {
      throw new ApiError(400, "Amount must be greater than zero");
    }

    if (durationValue <= 0) {
      throw new ApiError(400, "Duration value must be greater than zero");
    }

    if (!["days", "weeks", "months"].includes(durationType)) {
      throw new ApiError(
        400,
        "Duration type must be 'days', 'weeks', or 'months'"
      );
    }

    // Calculate end date based on duration
    const start = new Date(startDate);
    const end = new Date(start);

    switch (durationType) {
      case "days":
        end.setDate(start.getDate() + durationValue);
        break;
      case "weeks":
        end.setDate(start.getDate() + durationValue * 7);
        break;
      case "months":
        end.setMonth(start.getMonth() + durationValue);
        break;
    }

    // Set end date to end of day
    end.setHours(23, 59, 59, 999);

    // Check for overlapping active prepayments
    const existingPrepayments =
      await prepaymentRepository.findActiveByStudentId(studentId, start);

    const hasOverlap = existingPrepayments.some((prepayment) => {
      const existingStart = new Date(prepayment.startDate);
      const existingEnd = new Date(prepayment.endDate);

      return start <= existingEnd && end >= existingStart;
    });

    if (hasOverlap) {
      throw new ApiError(
        400,
        "Student already has an active prepayment for this period"
      );
    }

    return prepaymentRepository.create({
      student: { connect: { id: studentId } },
      class: { connect: { id: classId } },
      creator: { connect: { id: createdBy } },
      amount,
      durationType,
      durationValue,
      startDate: start,
      endDate: end,
    });
  },

  updatePrepayment: async (id: number, data: UpdatePrepaymentData) => {
    const existingPrepayment = await prepaymentRepository.findById(id);
    if (!existingPrepayment) {
      throw new ApiError(404, "Prepayment not found");
    }

    const updateData: any = { ...data };

    // If duration or start date is being updated, recalculate end date
    if (data.durationType || data.durationValue || data.startDate) {
      const durationType = data.durationType || existingPrepayment.durationType;
      const durationValue =
        data.durationValue || existingPrepayment.durationValue;
      const startDate = data.startDate
        ? new Date(data.startDate)
        : existingPrepayment.startDate;

      const endDate = new Date(startDate);
      switch (durationType) {
        case "days":
          endDate.setDate(startDate.getDate() + durationValue);
          break;
        case "weeks":
          endDate.setDate(startDate.getDate() + durationValue * 7);
          break;
        case "months":
          endDate.setMonth(startDate.getMonth() + durationValue);
          break;
      }
      endDate.setHours(23, 59, 59, 999);

      updateData.endDate = endDate;
      if (data.startDate) {
        updateData.startDate = startDate;
      }
    }

    return prepaymentRepository.update(id, updateData);
  },

  deletePrepayment: async (id: number) => {
    const existingPrepayment = await prepaymentRepository.findById(id);
    if (!existingPrepayment) {
      throw new ApiError(404, "Prepayment not found");
    }

    return prepaymentRepository.delete(id);
  },

  deactivatePrepayment: async (id: number) => {
    return prepaymentRepository.update(id, { isActive: false });
  },

  // Check if a student has active prepayment for a specific date
  hasActivePrepayment: async (studentId: number, date: Date) => {
    const activePrepayments = await prepaymentRepository.findActiveByStudentId(
      studentId,
      date
    );
    return activePrepayments.length > 0;
  },

  // Get students with active prepayments for a specific class and date
  getStudentsWithActivePrepayments: async (classId: number, date: Date) => {
    return prepaymentRepository.getStudentsWithActivePrepayments(classId, date);
  },

  // Cleanup expired prepayments (can be called by cron job)
  cleanupExpiredPrepayments: async () => {
    const currentDate = new Date();

    try {
      const expiredPrepayments =
        await prepaymentRepository.findExpiredPrepayments(currentDate);

      if (expiredPrepayments.length > 0) {
        await prepaymentRepository.deactivateExpired(currentDate);
        logger.info(
          `Deactivated ${expiredPrepayments.length} expired prepayments`
        );
      }

      return {
        deactivatedCount: expiredPrepayments.length,
        expiredPrepayments,
      };
    } catch (error) {
      logger.error("Error cleaning up expired prepayments:", error);
      throw error;
    }
  },

  // Get prepayment status for students in a class on a specific date
  getClassPrepaymentStatus: async (classId: number, date: Date) => {
    const studentsWithPrepayments =
      await prepaymentRepository.getStudentsWithActivePrepayments(
        classId,
        date
      );

    return studentsWithPrepayments.map((prepayment) => ({
      studentId: prepayment.student.id,
      studentName: prepayment.student.name,
      prepaymentId: prepayment.id,
      amount: prepayment.amount,
      startDate: prepayment.startDate,
      endDate: prepayment.endDate,
      durationType: prepayment.durationType,
      durationValue: prepayment.durationValue,
      isActive: prepayment.isActive,
    }));
  },
};
