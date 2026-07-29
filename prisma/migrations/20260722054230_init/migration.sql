-- CreateEnum
CREATE TYPE "public"."SmsType" AS ENUM ('BOOKING', 'CONFIRM', 'CANCEL', 'REMINDER');

-- CreateEnum
CREATE TYPE "public"."SmsStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "public"."appointments" ADD COLUMN     "note" TEXT;

-- CreateTable
CREATE TABLE "public"."sms_logs" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "type" "public"."SmsType" NOT NULL,
    "status" "public"."SmsStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL,
    "appointmentId" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sms_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."sms_logs" ADD CONSTRAINT "sms_logs_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
