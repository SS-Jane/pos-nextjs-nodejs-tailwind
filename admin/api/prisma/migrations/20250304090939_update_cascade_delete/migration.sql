-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_FoodCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "FoodSize" DROP CONSTRAINT "FoodSize_foodCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "SaleTemp" DROP CONSTRAINT "SaleTemp_foodId_fkey";

-- DropForeignKey
ALTER TABLE "SaleTempDetail" DROP CONSTRAINT "SaleTempDetail_foodId_fkey";

-- DropForeignKey
ALTER TABLE "SaleTempDetail" DROP CONSTRAINT "SaleTempDetail_saleTempId_fkey";

-- DropForeignKey
ALTER TABLE "Taste" DROP CONSTRAINT "Taste_foodCategoryId_fkey";

-- AlterTable
ALTER TABLE "SaleTemp" ALTER COLUMN "foodId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "FoodSize" ADD CONSTRAINT "FoodSize_foodCategoryId_fkey" FOREIGN KEY ("foodCategoryId") REFERENCES "FoodCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Taste" ADD CONSTRAINT "Taste_foodCategoryId_fkey" FOREIGN KEY ("foodCategoryId") REFERENCES "FoodCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_FoodCategoryId_fkey" FOREIGN KEY ("FoodCategoryId") REFERENCES "FoodCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTemp" ADD CONSTRAINT "SaleTemp_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_saleTempId_fkey" FOREIGN KEY ("saleTempId") REFERENCES "SaleTemp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
