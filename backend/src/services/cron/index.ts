import { setupDailyRecordCreation } from "./daily-records.cron";
import { setupPrepaymentCleanup } from "./prepayment-cleanup.cron";

export const setupCronJobs = () => {
  // Setup daily record creation job
  setupDailyRecordCreation();
  // Additional cron jobs - Prepayments
  setupPrepaymentCleanup();
};
