import type { Request, Response } from "express";
import { expenseService } from "../../services/expense-service";
import { referenceService } from "../../services/reference-service";
import { catchAsync } from "../../utils/catch-async";

export const expenseController = {
  getAllExpenses: catchAsync(async (req: Request, res: Response) => {
    // Accept ?from=YYYY-MM-DD&to=YYYY-MM-DD or ?period=year|month|week|all
    let { from, to, period } = req.query as {
      from?: string;
      to?: string;
      period?: string;
    };
    let filter: { from?: Date; to?: Date } = {};
    const now = new Date();
    if (period && period !== "all") {
      if (period === "year") {
        filter.from = new Date(now.getFullYear(), 0, 1);
        filter.to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      } else if (period === "month") {
        filter.from = new Date(now.getFullYear(), now.getMonth(), 1);
        filter.to = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
      } else if (period === "week") {
        const day = now.getDay();
        const diffToMonday = (day + 6) % 7;
        filter.from = new Date(now);
        filter.from.setDate(now.getDate() - diffToMonday);
        filter.from.setHours(0, 0, 0, 0);
        filter.to = new Date(filter.from);
        filter.to.setDate(filter.from.getDate() + 6);
        filter.to.setHours(23, 59, 59, 999);
      }
    } else {
      if (from) filter.from = new Date(from);
      if (to) filter.to = new Date(to);
    }
    const expenses = await expenseService.getAllExpenses(filter);
    res.status(200).json(expenses);
  }),

  getExpenseById: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const expense = await expenseService.getExpenseById(id);
    res.status(200).json(expense);
  }),

  createExpense: catchAsync(async (req: Request, res: Response) => {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json(expense);
  }),

  updateExpense: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const expense = await expenseService.updateExpense(id, req.body);
    res.status(200).json(expense);
  }),

  deleteExpense: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    await expenseService.deleteExpense(id);
    res.status(204).end();
  }),

  getAllReferences: catchAsync(async (req: Request, res: Response) => {
    const references = await referenceService.getAllReferences();
    res.status(200).json(references);
  }),

  getReferenceById: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const reference = await referenceService.getReferenceById(id);
    res.status(200).json(reference);
  }),

  createReference: catchAsync(async (req: Request, res: Response) => {
    const reference = await referenceService.createReference(req.body);
    res.status(201).json(reference);
  }),

  updateReference: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const reference = await referenceService.updateReference(id, req.body);
    res.status(200).json(reference);
  }),

  deleteReference: catchAsync(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    await referenceService.deleteReference(id);
    res.status(204).end();
  }),
};
