import cron from "node-cron"
import { prepaymentService } from "../prepayment-service"
import { logger } from "../../utils/logger"

export const setupPrepaymentCleanup = () => {
  // Schedule the job to run every day at 1:00 AM
  cron.schedule("0 1 * * *", async () => {
    logger.info("Running prepayment cleanup job")

    try {
      const result = await prepaymentService.cleanupExpiredPrepayments()

      if (result.deactivatedCount > 0) {
        logger.info(`Prepayment cleanup completed. Deactivated ${result.deactivatedCount} expired prepayments`)
      } else {
        logger.info("Prepayment cleanup completed. No expired prepayments found")
      }
    } catch (error) {
      logger.error("Error in prepayment cleanup job:", error)
    }
  })

  logger.info("Prepayment cleanup cron job scheduled")
}
