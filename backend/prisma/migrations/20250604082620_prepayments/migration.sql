-- CreateTable
CREATE TABLE "Prepayment" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "durationType" TEXT NOT NULL,
    "durationValue" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prepayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prepayment_studentId_idx" ON "Prepayment"("studentId");

-- CreateIndex
CREATE INDEX "Prepayment_classId_idx" ON "Prepayment"("classId");

-- CreateIndex
CREATE INDEX "Prepayment_startDate_idx" ON "Prepayment"("startDate");

-- CreateIndex
CREATE INDEX "Prepayment_endDate_idx" ON "Prepayment"("endDate");

-- CreateIndex
CREATE INDEX "Prepayment_isActive_idx" ON "Prepayment"("isActive");

-- AddForeignKey
ALTER TABLE "Prepayment" ADD CONSTRAINT "Prepayment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prepayment" ADD CONSTRAINT "Prepayment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prepayment" ADD CONSTRAINT "Prepayment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
