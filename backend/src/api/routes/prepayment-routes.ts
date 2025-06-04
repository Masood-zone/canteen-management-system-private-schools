import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { prepaymentController } from "../controllers/prepayment-controller";

const router = express.Router();

router.use(authenticate);

// Get all prepayments
router.get("/", prepaymentController.getAll);

// Get prepayment by ID
router.get("/:id", prepaymentController.getById);

// Get prepayments by student ID
router.get("/student/:studentId", prepaymentController.getByStudentId);

// Get active prepayments by student ID
router.get(
  "/student/:studentId/active",
  prepaymentController.getActiveByStudentId
);

// Check if student has active prepayment for a date
router.get(
  "/student/:studentId/check",
  prepaymentController.checkStudentPrepayment
);

// Get prepayments by class ID
router.get("/class/:classId", prepaymentController.getByClassId);

// Get active prepayments by class ID
router.get("/class/:classId/active", prepaymentController.getActiveByClassId);

// Get class prepayment status for a specific date
router.get(
  "/class/:classId/status",
  prepaymentController.getClassPrepaymentStatus
);

// Create new prepayment
router.post("/", prepaymentController.create);

// Update prepayment
router.put("/:id", prepaymentController.update);

// Deactivate prepayment
router.patch("/:id/deactivate", prepaymentController.deactivate);

// Delete prepayment
router.delete("/:id", prepaymentController.delete);

// Cleanup expired prepayments
router.post("/cleanup-expired", prepaymentController.cleanupExpired);

export const prepaymentRoutes = router;
