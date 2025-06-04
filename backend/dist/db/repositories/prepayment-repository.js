"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepaymentRepository = void 0;
const client_1 = require("../client");
exports.prepaymentRepository = {
    findAll: async () => {
        return client_1.prisma.prepayment.findMany({
            include: {
                student: true,
                class: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    findById: async (id) => {
        return client_1.prisma.prepayment.findUnique({
            where: { id },
            include: {
                student: true,
                class: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    },
    findByStudentId: async (studentId) => {
        return client_1.prisma.prepayment.findMany({
            where: { studentId },
            include: {
                student: true,
                class: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    findByClassId: async (classId) => {
        return client_1.prisma.prepayment.findMany({
            where: { classId },
            include: {
                student: true,
                class: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    findActiveByStudentId: async (studentId, currentDate) => {
        return client_1.prisma.prepayment.findMany({
            where: {
                studentId,
                isActive: true,
                startDate: {
                    lte: currentDate,
                },
                endDate: {
                    gte: currentDate,
                },
            },
            include: {
                student: true,
                class: true,
            },
            orderBy: {
                endDate: "desc",
            },
        });
    },
    findActiveByClassId: async (classId, currentDate) => {
        return client_1.prisma.prepayment.findMany({
            where: {
                classId,
                isActive: true,
                startDate: {
                    lte: currentDate,
                },
                endDate: {
                    gte: currentDate,
                },
            },
            include: {
                student: true,
                class: true,
            },
            orderBy: {
                student: {
                    name: "asc",
                },
            },
        });
    },
    findExpiredPrepayments: async (currentDate) => {
        return client_1.prisma.prepayment.findMany({
            where: {
                isActive: true,
                endDate: {
                    lt: currentDate,
                },
            },
            include: {
                student: true,
                class: true,
            },
        });
    },
    create: async (data) => {
        return client_1.prisma.prepayment.create({
            data,
            include: {
                student: true,
                class: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    },
    update: async (id, data) => {
        return client_1.prisma.prepayment.update({
            where: { id },
            data,
            include: {
                student: true,
                class: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    },
    delete: async (id) => {
        return client_1.prisma.prepayment.delete({
            where: { id },
        });
    },
    deactivateExpired: async (currentDate) => {
        return client_1.prisma.prepayment.updateMany({
            where: {
                isActive: true,
                endDate: {
                    lt: currentDate,
                },
            },
            data: {
                isActive: false,
            },
        });
    },
    getStudentsWithActivePrepayments: async (classId, date) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return client_1.prisma.prepayment.findMany({
            where: {
                classId,
                isActive: true,
                startDate: {
                    lte: endOfDay,
                },
                endDate: {
                    gte: startOfDay,
                },
            },
            include: {
                student: true,
            },
            distinct: ["studentId"],
        });
    },
};
//# sourceMappingURL=prepayment-repository.js.map