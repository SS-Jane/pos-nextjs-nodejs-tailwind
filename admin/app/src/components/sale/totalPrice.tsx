"use client";

import { useEffect, useState } from "react";
import { SaleTemps } from "./tableDinner";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/config";

interface TotalPriceProps {
  saleTemps: SaleTemps[];
  fetchDataSaleTemp: () => Promise<void>;
}

export default function TotalPrice({
  saleTemps,
  fetchDataSaleTemp,
}: TotalPriceProps) {
  const [saleTempDetails, setSaleTempDetails] = useState<any[]>([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (saleTemps.length > 0) {
      setSaleTempDetails(saleTemps[0]?.SaleTempDetails ?? []);
    }
    sumAmount(saleTemps);
  }, [saleTemps]);

  const removeSaleTemp = async (id: number) => {
    try {
      const button = await Swal.fire({
        title: "Are you remove this list?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        await axios.delete(`${config.apiServer}/api/saleTemp/remove/${id}`);
        fetchDataSaleTemp();
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error Remove sale",
        text: error.message,
        icon: "error",
      });
    }
  };

  const updateQty = async (id: number, qty: number) => {
    try {
      const payload = {
        qty: qty,
        id: id,
      };

      await axios.put(`${config.apiServer}/api/saleTemp/updateQty`, payload);
      fetchDataSaleTemp();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const sumAmount = (saleTemps: any) => {
    let total = 0;
    saleTemps.forEach((item: any) => {
      total += item.Food.price * item.qty;
    });

    return setAmount(total);
  };

  return (
    <div className=" dark:bg-black shadow-lg rounded-lg p-5 w-full max-w-md">
      <div className="bg-white dark:bg-black text-black dark:text-white font-semibold text-right p-4 rounded-lg text-2xl">
        ฿{amount.toLocaleString("th-TH")}
      </div>
      <div className="mt-4 space-y-4">
        {saleTemps.length === 0 ? (
          <p className="text-gray-500 text-center">No items added.</p>
        ) : (
          saleTemps.map((item: any) => (
            <div
              className="flex flex-col border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 rounded-lg shadow-sm space-y-3"
              key={item.id}
            >
              <div>
                <h5 className="text-lg font-semibold text-gray-800   text-start dark:text-gray-200">
                  {item.Food.name}
                </h5>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {item.Food.price} x {item.qty} = ฿
                  {(item.Food.price * item.qty).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Button
                  size="sm"
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  disabled={item.qty === 0}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
                <Input
                  value={item.qty}
                  disabled
                  className="text-center w-10 bg-gray-200 rounded-md"
                />
                <Button
                  size="sm"
                  onClick={() => updateQty(item.id, item.qty + 1)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>

              <div className="flex justify-between mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={(e) => removeSaleTemp(item.id)}
                >
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
