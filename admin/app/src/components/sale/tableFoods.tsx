"use client";

import config from "@/config";
import Image from "next/image";
import { Foods } from "./tableDinner";
import Swal from "sweetalert2";
import axios from "axios";

interface TableFoodsProps {
  foods: Foods[];
  tableDinner: number;
  fetchDataSaleTemp: () => Promise<void>;
}

export default function TableFoods({
  foods,
  tableDinner,
  fetchDataSaleTemp,
}: TableFoodsProps) {
  const imgSrc = (item: any) => {
    return item.img
      ? `${config.apiServer}/uploads/${item.img}`
      : `${config.apiServer}/uploads/default-image.webp`;
  };

  const sale = async (foodId: number) => {
    try {
      const payload = {
        tableNumber: tableDinner,
        userId: Number(localStorage.getItem("posUserId")),
        foodId: foodId,
      };

      await axios.post(`${config.apiServer}/api/saleTemp/create`, payload);
      fetchDataSaleTemp();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {foods.map((food) => (
        <div
          className="relative flex flex-col items-center bg-white dark:bg-gray-800 border rounded-lg shadow-md p-3 transition-transform transform hover:scale-105 cursor-pointer"
          key={food.id}
          onClick={() => sale(food.id)}
        >
          <div className="relative w-full h-36 sm:h-40 md:h-44">
            <Image
              src={imgSrc(food)}
              alt={food.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          <div className="w-full mt-3 text-center">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
              {food.name}
            </h5>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              ฿{food.price}
            </p>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded-md hidden">
            Added
          </div>
        </div>
      ))}
    </div>
  );
}
