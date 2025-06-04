import { prisma } from "../client"
import type { Prisma } from "@prisma/client"

export const prepaymentRepository = {
  findAll: async () => {
    return prisma.prepayment.findMany({
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
    })
  },

  findById: async (id: number) => {
    return prisma.prepayment.findUnique({
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
    })
  },

  findByStudentId: async (studentId: number) => {
    return prisma.prepayment.findMany({
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
    })
  },

  findByClassId: async (classId: number) => {
    return prisma.prepayment.findMany({
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
    })
  },

  findActiveByStudentId: async (studentId: number, currentDate: Date) => {
    return prisma.prepayment.findMany({
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
    })
  },

  findActiveByClassId: async (classId: number, currentDate: Date) => {
    return prisma.prepayment.findMany({
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
    })
  },

  findExpiredPrepayments: async (currentDate: Date) => {
    return prisma.prepayment.findMany({
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
    })
  },

  create: async (data: Prisma.PrepaymentCreateInput) => {
    return prisma.prepayment.create({
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
    })
  },

  update: async (id: number, data: Prisma.PrepaymentUpdateInput) => {
    return prisma.prepayment.update({
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
    })
  },

  delete: async (id: number) => {
    return prisma.prepayment.delete({
      where: { id },
    })
  },

  deactivateExpired: async (currentDate: Date) => {
    return prisma.prepayment.updateMany({
      where: {
        isActive: true,
        endDate: {
          lt: currentDate,
        },
      },
      data: {
        isActive: false,
      },
    })
  },

  // Get students with active prepayments for a specific date
  getStudentsWithActivePrepayments: async (classId: number, date: Date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return prisma.prepayment.findMany({
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
    })
  },
}
