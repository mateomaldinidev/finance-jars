-- CreateTable
CREATE TABLE "IncomeDistribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "incomeMovementId" TEXT NOT NULL,
    "totalAmount" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL,
    "distributedAmount" DECIMAL NOT NULL DEFAULT 0,
    "distributedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IncomeDistribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "IncomeDistribution_incomeMovementId_fkey" FOREIGN KEY ("incomeMovementId") REFERENCES "Movement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "IncomeDistribution_incomeMovementId_key" ON "IncomeDistribution"("incomeMovementId");

-- CreateIndex
CREATE INDEX "IncomeDistribution_userId_createdAt_idx" ON "IncomeDistribution"("userId", "createdAt");
