/*
  Warnings:

  - You are about to drop the column `image` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `services` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `services` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[slug]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `durationMin` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."blogs" DROP COLUMN "image",
ADD COLUMN     "coverImage" TEXT;

-- AlterTable
ALTER TABLE "public"."services" DROP COLUMN "duration",
DROP COLUMN "name",
ADD COLUMN     "durationMin" INTEGER NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "public"."site_settings" (
    "id" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    "mapZoom" INTEGER NOT NULL DEFAULT 16,
    "consultationTitle" TEXT,
    "consultationSubtitle" TEXT,
    "consultationButtonText" TEXT,
    "consultationBackgroundImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "public"."services"("slug");
