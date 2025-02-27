-- CreateTable
CREATE TABLE "Taste" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "foodCategoriesId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'use',

    CONSTRAINT "Taste_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Taste" ADD CONSTRAINT "Taste_foodCategoriesId_fkey" FOREIGN KEY ("foodCategoriesId") REFERENCES "FoodCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
