"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPrepaymentCleanup = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prepayment_service_1 = require("../prepayment-service");
const logger_1 = require("../../utils/logger");
const setupPrepaymentCleanup = () => {
    node_cron_1.default.schedule("0 1 * * *", async () => {
        logger_1.logger.info("Running prepayment cleanup job");
        try {
            const result = await prepayment_service_1.prepaymentService.cleanupExpiredPrepayments();
            if (result.deactivatedCount > 0) {
                logger_1.logger.info(`Prepayment cleanup completed. Deactivated ${result.deactivatedCount} expired prepayments`);
            }
            else {
                logger_1.logger.info("Prepayment cleanup completed. No expired prepayments found");
            }
        }
        catch (error) {
            logger_1.logger.error("Error in prepayment cleanup job:", error);
        }
    });
    logger_1.logger.info("Prepayment cleanup cron job scheduled");
};
exports.setupPrepaymentCleanup = setupPrepaymentCleanup;
//# sourceMappingURL=prepayment-cleanup.cron.js.map