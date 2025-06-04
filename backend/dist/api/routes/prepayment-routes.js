"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../../middlewares/authenticate");
const prepayment_controller_1 = require("../controllers/prepayment-controller");
const router = express_1.default.Router();
router.use(authenticate_1.authenticate);
router.get("/", prepayment_controller_1.prepaymentController.getAll);
router.get("/:id", prepayment_controller_1.prepaymentController.getById);
router.get("/student/:studentId", prepayment_controller_1.prepaymentController.getByStudentId);
router.get("/student/:studentId/active", prepayment_controller_1.prepaymentController.getActiveByStudentId);
router.get("/student/:studentId/check", prepayment_controller_1.prepaymentController.checkStudentPrepayment);
router.get("/class/:classId", prepayment_controller_1.prepaymentController.getByClassId);
router.get("/class/:classId/active", prepayment_controller_1.prepaymentController.getActiveByClassId);
router.get("/class/:classId/status", prepayment_controller_1.prepaymentController.getClassPrepaymentStatus);
router.post("/", prepayment_controller_1.prepaymentController.create);
router.put("/:id", prepayment_controller_1.prepaymentController.update);
router.patch("/:id/deactivate", prepayment_controller_1.prepaymentController.deactivate);
router.delete("/:id", prepayment_controller_1.prepaymentController.delete);
router.post("/cleanup-expired", prepayment_controller_1.prepaymentController.cleanupExpired);
exports.prepaymentRoutes = router;
//# sourceMappingURL=prepayment-routes.js.map