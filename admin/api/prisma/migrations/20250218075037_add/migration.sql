/*
  Warnings:

  - You are about to drop the `FoodType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FoodType";

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'use',

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);
