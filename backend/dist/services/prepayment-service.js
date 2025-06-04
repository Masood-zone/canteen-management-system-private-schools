"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepaymentService = void 0;
const prepayment_repository_1 = require("../db/repositories/prepayment-repository");
const api_error_1 = require("../utils/api-error");
const logger_1 = require("../utils/logger");
exports.prepaymentService = {
    getAllPrepayments: async () => {
        return prepayment_repository_1.prepaymentRepository.findAll();
    },
    getPrepaymentById: async (id) => {
        const prepayment = await prepayment_repository_1.prepaymentRepository.findById(id);
        if (!prepayment) {
            throw new api_error_1.ApiError(404, "Prepayment not found");
        }
        return prepayment;
    },
    getPrepaymentsByStudentId: async (studentId) => {
        return prepayment_repository_1.prepaymentRepository.findByStudentId(studentId);
    },
    getPrepaymentsByClassId: async (classId) => {
        return prepayment_repository_1.prepaymentRepository.findByClassId(classId);
    },
    getActivePrepaymentsByStudentId: async (studentId) => {
        const currentDate = new Date();
        return prepayment_repository_1.prepaymentRepository.findActiveByStudentId(studentId, currentDate);
    },
    getActivePrepaymentsByClassId: async (classId) => {
        const currentDate = new Date();
        return prepayment_repository_1.prepaymentRepository.findActiveByClassId(classId, currentDate);
    },
    createPrepayment: async (data) => {
        const { studentId, classId, amount, durationType, durationValue, startDate, createdBy, } = data;
        if (amount <= 0) {
            throw new api_error_1.ApiError(400, "Amount must be greater than zero");
        }
        if (durationValue <= 0) {
            throw new api_error_1.ApiError(400, "Duration value must be greater than zero");
        }
        if (!["days", "weeks", "months"].includes(durationType)) {
            throw new api_error_1.ApiError(400, "Duration type must be 'days', 'weeks', or 'months'");
        }
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
        end.setHours(23, 59, 59, 999);
        const existingPrepayments = await prepayment_repository_1.prepaymentRepository.findActiveByStudentId(studentId, start);
        const hasOverlap = existingPrepayments.some((prepayment) => {
            const existingStart = new Date(prepayment.startDate);
            const existingEnd = new Date(prepayment.endDate);
            return start <= existingEnd && end >= existingStart;
        });
        if (hasOverlap) {
            throw new api_error_1.ApiError(400, "Student already has an active prepayment for this period");
        }
        return prepayment_repository_1.prepaymentRepository.create({
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
    updatePrepayment: async (id, data) => {
        const existingPrepayment = await prepayment_repository_1.prepaymentRepository.findById(id);
        if (!existingPrepayment) {
            throw new api_error_1.ApiError(404, "Prepayment not found");
        }
        const updateData = Object.assign({}, data);
        if (data.durationType || data.durationValue || data.startDate) {
            const durationType = data.durationType || existingPrepayment.durationType;
            const durationValue = data.durationValue || existingPrepayment.durationValue;
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
        return prepayment_repository_1.prepaymentRepository.update(id, updateData);
    },
    deletePrepayment: async (id) => {
        const existingPrepayment = await prepayment_repository_1.prepaymentRepository.findById(id);
        if (!existingPrepayment) {
            throw new api_error_1.ApiError(404, "Prepayment not found");
        }
        return prepayment_repository_1.prepaymentRepository.delete(id);
    },
    deactivatePrepayment: async (id) => {
        return prepayment_repository_1.prepaymentRepository.update(id, { isActive: false });
    },
    hasActivePrepayment: async (studentId, date) => {
        const activePrepayments = await prepayment_repository_1.prepaymentRepository.findActiveByStudentId(studentId, date);
        return activePrepayments.length > 0;
    },
    getStudentsWithActivePrepayments: async (classId, date) => {
        return prepayment_repository_1.prepaymentRepository.getStudentsWithActivePrepayments(classId, date);
    },
    cleanupExpiredPrepayments: async () => {
        const currentDate = new Date();
        try {
            const expiredPrepayments = await prepayment_repository_1.prepaymentRepository.findExpiredPrepayments(currentDate);
            if (expiredPrepayments.length > 0) {
                await prepayment_repository_1.prepaymentRepository.deactivateExpired(currentDate);
                logger_1.logger.info(`Deactivated ${expiredPrepayments.length} expired prepayments`);
            }
            return {
                deactivatedCount: expiredPrepayments.length,
                expiredPrepayments,
            };
        }
        catch (error) {
            logger_1.logger.error("Error cleaning up expired prepayments:", error);
            throw error;
        }
    },
    getClassPrepaymentStatus: async (classId, date) => {
        const studentsWithPrepayments = await prepayment_repository_1.prepaymentRepository.getStudentsWithActivePrepayments(classId, date);
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
//# sourceMappingURL=prepayment-service.js.map