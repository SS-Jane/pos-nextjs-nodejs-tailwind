"use client";

import { useEffect, useState } from "react";
import { SaleTemps } from "./tableDinner";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

interface TotalPriceProps {
  saleTemps: SaleTemps[];
}

export default function TotalPrice({ saleTemps }: TotalPriceProps) {
  const [saleTempDetails, setSaleTempDetails] = useState<any[]>([]);

  useEffect(() => {
    if (saleTemps.length > 0) {
      setSaleTempDetails(saleTemps[0]?.SaleTempDetails ?? []);
    }
  }, [saleTemps]);
  return (
    <div className=" dark:bg-black shadow-lg rounded-lg p-5 w-full max-w-md">
      <div className="bg-white dark:bg-black text-black dark:text-white font-semibold text-right p-4 rounded-lg text-2xl">
        ฿
        {saleTempDetails
          .reduce((acc, item) => acc + item.Food.price * 1, 0)
          .toFixed(2)}
      </div>
      <div className="mt-4 space-y-4">
        {saleTempDetails.length === 0 ? (
          <p className="text-gray-500 text-center">No items added.</p>
        ) : (
          saleTempDetails.map((item: any) => (
            <div
              className="flex flex-col border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 rounded-lg shadow-sm space-y-3"
              key={item.Food.id}
            >
              <div>
                <h5 className="text-lg font-semibold text-gray-800   text-start dark:text-gray-200">
                  {item.Food.name}
                </h5>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {item.Food.price} x 1 = ฿{(item.Food.price * 1).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Button size="sm">
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
                <Input
                  value="1"
                  disabled
                  className="text-center w-10 bg-gray-200 rounded-md"
                />
                <Button size="sm">
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>

              <div className="flex justify-between mt-2">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                  Cancel
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
