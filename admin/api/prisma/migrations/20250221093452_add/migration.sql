-- CreateTable
CREATE TABLE "FoodSize" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "foodCategoryId" INTEGER NOT NULL,
    "moneyAdded" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'use',

    CONSTRAINT "FoodSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodSize" ADD CONSTRAINT "FoodSize_foodCategoryId_fkey" FOREIGN KEY ("foodCategoryId") REFERENCES "FoodCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
