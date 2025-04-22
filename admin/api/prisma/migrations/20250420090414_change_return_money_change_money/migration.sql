/*
  Warnings:

  - You are about to drop the column `returnMoney` on the `BillSale` table. All the data in the column will be lost.
  - Added the required column `changeMoney` to the `BillSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillSale" DROP COLUMN "returnMoney",
ADD COLUMN     "changeMoney" INTEGER NOT NULL;
