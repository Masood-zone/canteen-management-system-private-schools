"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCronJobs = void 0;
const daily_records_cron_1 = require("./daily-records.cron");
const prepayment_cleanup_cron_1 = require("./prepayment-cleanup.cron");
const setupCronJobs = () => {
    (0, daily_records_cron_1.setupDailyRecordCreation)();
    (0, prepayment_cleanup_cron_1.setupPrepaymentCleanup)();
};
exports.setupCronJobs = setupCronJobs;
//# sourceMappingURL=index.js.map