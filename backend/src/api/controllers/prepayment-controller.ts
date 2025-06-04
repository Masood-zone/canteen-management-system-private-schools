import type { Request, Response } from "express"
import { prepaymentService } from "../../services/prepayment-service"
import { catchAsync } from "../../utils/catch-async"
import { ApiError } from "../../utils/api-error"

export const prepaymentController = {
  getAll: catchAsync(async (req: Request, res: Response) => {
    const prepayments = await prepaymentService.getAllPrepayments()
    res.json(prepayments)
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id)
    const prepayment = await prepaymentService.getPrepaymentById(id)
    res.json(prepayment)
  }),

  getByStudentId: catchAsync(async (req: Request, res: Response) => {
    const studentId = Number.parseInt(req.params.studentId)
    const prepayments = await prepaymentService.getPrepaymentsByStudentId(studentId)
    res.json(prepayments)
  }),

  getByClassId: catchAsync(async (req: Request, res: Response) => {
    const classId = Number.parseInt(req.params.classId)
    const prepayments = await prepaymentService.getPrepaymentsByClassId(classId)
    res.json(prepayments)
  }),

  getActiveByStudentId: catchAsync(async (req: Request, res: Response) => {
    const studentId = Number.parseInt(req.params.studentId)
    const prepayments = await prepaymentService.getActivePrepaymentsByStudentId(studentId)
    res.json(prepayments)
  }),

  getActiveByClassId: catchAsync(async (req: Request, res: Response) => {
    const classId = Number.parseInt(req.params.classId)
    const prepayments = await prepaymentService.getActivePrepaymentsByClassId(classId)
    res.json(prepayments)
  }),

  getClassPrepaymentStatus: catchAsync(async (req: Request, res: Response) => {
    const classId = Number.parseInt(req.params.classId)
    const date = req.query.date ? new Date(req.query.date as string) : new Date()

    const status = await prepaymentService.getClassPrepaymentStatus(classId, date)
    res.json(status)
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const { studentId, classId, amount, durationType, durationValue, startDate } = req.body

    // Get user ID from authenticated request
    const createdBy = (req as any).user?.id
    if (!createdBy) {
      throw new ApiError(401, "User not authenticated")
    }

    if (!studentId || !classId || !amount || !durationType || !durationValue || !startDate) {
      throw new ApiError(400, "Missing required fields")
    }

    const prepayment = await prepaymentService.createPrepayment({
      studentId: Number.parseInt(studentId),
      classId: Number.parseInt(classId),
      amount: Number.parseInt(amount),
      durationType,
      durationValue: Number.parseInt(durationValue),
      startDate,
      createdBy,
    })

    res.status(201).json(prepayment)
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id)
    const updateData = req.body

    const prepayment = await prepaymentService.updatePrepayment(id, updateData)
    res.json(prepayment)
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id)
    await prepaymentService.deletePrepayment(id)
    res.status(204).send()
  }),

  deactivate: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id)
    const prepayment = await prepaymentService.deactivatePrepayment(id)
    res.json(prepayment)
  }),

  checkStudentPrepayment: catchAsync(async (req: Request, res: Response) => {
    const studentId = Number.parseInt(req.params.studentId)
    const date = req.query.date ? new Date(req.query.date as string) : new Date()

    const hasActivePrepayment = await prepaymentService.hasActivePrepayment(studentId, date)
    res.json({ hasActivePrepayment })
  }),

  cleanupExpired: catchAsync(async (req: Request, res: Response) => {
    const result = await prepaymentService.cleanupExpiredPrepayments()
    res.json(result)
  }),
}
