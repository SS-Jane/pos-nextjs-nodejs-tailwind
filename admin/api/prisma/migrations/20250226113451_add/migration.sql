/*
  Warnings:

  - You are about to drop the column `foodCategoriesId` on the `Taste` table. All the data in the column will be lost.
  - Added the required column `foodCategoryId` to the `Taste` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Taste" DROP CONSTRAINT "Taste_foodCategoriesId_fkey";

-- AlterTable
ALTER TABLE "Taste" DROP COLUMN "foodCategoriesId",
ADD COLUMN     "foodCategoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Taste" ADD CONSTRAINT "Taste_foodCategoryId_fkey" FOREIGN KEY ("foodCategoryId") REFERENCES "FoodCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
