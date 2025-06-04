"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepaymentController = void 0;
const prepayment_service_1 = require("../../services/prepayment-service");
const catch_async_1 = require("../../utils/catch-async");
const api_error_1 = require("../../utils/api-error");
exports.prepaymentController = {
    getAll: (0, catch_async_1.catchAsync)(async (req, res) => {
        const prepayments = await prepayment_service_1.prepaymentService.getAllPrepayments();
        res.json(prepayments);
    }),
    getById: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const prepayment = await prepayment_service_1.prepaymentService.getPrepaymentById(id);
        res.json(prepayment);
    }),
    getByStudentId: (0, catch_async_1.catchAsync)(async (req, res) => {
        const studentId = Number.parseInt(req.params.studentId);
        const prepayments = await prepayment_service_1.prepaymentService.getPrepaymentsByStudentId(studentId);
        res.json(prepayments);
    }),
    getByClassId: (0, catch_async_1.catchAsync)(async (req, res) => {
        const classId = Number.parseInt(req.params.classId);
        const prepayments = await prepayment_service_1.prepaymentService.getPrepaymentsByClassId(classId);
        res.json(prepayments);
    }),
    getActiveByStudentId: (0, catch_async_1.catchAsync)(async (req, res) => {
        const studentId = Number.parseInt(req.params.studentId);
        const prepayments = await prepayment_service_1.prepaymentService.getActivePrepaymentsByStudentId(studentId);
        res.json(prepayments);
    }),
    getActiveByClassId: (0, catch_async_1.catchAsync)(async (req, res) => {
        const classId = Number.parseInt(req.params.classId);
        const prepayments = await prepayment_service_1.prepaymentService.getActivePrepaymentsByClassId(classId);
        res.json(prepayments);
    }),
    getClassPrepaymentStatus: (0, catch_async_1.catchAsync)(async (req, res) => {
        const classId = Number.parseInt(req.params.classId);
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const status = await prepayment_service_1.prepaymentService.getClassPrepaymentStatus(classId, date);
        res.json(status);
    }),
    create: (0, catch_async_1.catchAsync)(async (req, res) => {
        var _a;
        const { studentId, classId, amount, durationType, durationValue, startDate } = req.body;
        const createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!createdBy) {
            throw new api_error_1.ApiError(401, "User not authenticated");
        }
        if (!studentId || !classId || !amount || !durationType || !durationValue || !startDate) {
            throw new api_error_1.ApiError(400, "Missing required fields");
        }
        const prepayment = await prepayment_service_1.prepaymentService.createPrepayment({
            studentId: Number.parseInt(studentId),
            classId: Number.parseInt(classId),
            amount: Number.parseInt(amount),
            durationType,
            durationValue: Number.parseInt(durationValue),
            startDate,
            createdBy,
        });
        res.status(201).json(prepayment);
    }),
    update: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const updateData = req.body;
        const prepayment = await prepayment_service_1.prepaymentService.updatePrepayment(id, updateData);
        res.json(prepayment);
    }),
    delete: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        await prepayment_service_1.prepaymentService.deletePrepayment(id);
        res.status(204).send();
    }),
    deactivate: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const prepayment = await prepayment_service_1.prepaymentService.deactivatePrepayment(id);
        res.json(prepayment);
    }),
    checkStudentPrepayment: (0, catch_async_1.catchAsync)(async (req, res) => {
        const studentId = Number.parseInt(req.params.studentId);
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const hasActivePrepayment = await prepayment_service_1.prepaymentService.hasActivePrepayment(studentId, date);
        res.json({ hasActivePrepayment });
    }),
    cleanupExpired: (0, catch_async_1.catchAsync)(async (req, res) => {
        const result = await prepayment_service_1.prepaymentService.cleanupExpiredPrepayments();
        res.json(result);
    }),
};
//# sourceMappingURL=prepayment-controller.js.map