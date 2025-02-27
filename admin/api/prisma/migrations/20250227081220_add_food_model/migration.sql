-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'use',
    "price" INTEGER NOT NULL,
    "FoodCategoryId" INTEGER NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_FoodCategoryId_fkey" FOREIGN KEY ("FoodCategoryId") REFERENCES "FoodCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
