"use client";

import config from "@/config";
import Image from "next/image";
import { Foods } from "./tableDinner";
import Swal from "sweetalert2";
import axios from "axios";

interface TableFoodsProps {
  foods: Foods[];
  tableDinner : number,
}

export default function TableFoods({ foods,tableDinner }: TableFoodsProps) {
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
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {foods.map((food) => (
        <div className="card border rounded-lg shadow-md p-4" key={food.id}>
          <Image
            src={imgSrc(food)}
            alt={food.name}
            width={400}
            height={300}
            className="w-full h-auto object-cover rounded-lg"
            onClick={e => sale(food.id)}
          />
          <div className="card-body mt-3">
            <h5 className="text-lg font-semibold dark:text-white">
              {food.name}
            </h5>
            <p className="text-gray-500">฿{food.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
