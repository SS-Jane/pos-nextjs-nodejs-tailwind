/*
  Warnings:

  - You are about to drop the column `tableNo` on the `BillSale` table. All the data in the column will be lost.
  - Added the required column `tableNumber` to the `BillSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillSale" DROP COLUMN "tableNo",
ADD COLUMN     "tableNumber" INTEGER NOT NULL;
