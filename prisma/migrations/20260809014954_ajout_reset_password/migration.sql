-- CreateTable
CREATE TABLE "tokens_reinitialisation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expireLe" TIMESTAMP(3) NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_reinitialisation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_reinitialisation_token_key" ON "tokens_reinitialisation"("token");

-- CreateIndex
CREATE INDEX "tokens_reinitialisation_email_idx" ON "tokens_reinitialisation"("email");

-- CreateIndex
CREATE INDEX "tokens_reinitialisation_token_idx" ON "tokens_reinitialisation"("token");
