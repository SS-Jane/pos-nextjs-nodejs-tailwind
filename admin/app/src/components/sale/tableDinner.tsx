"use client";

import { useState, useEffect, useRef } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Badge from "../ui/badge/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faMugHot,
  faList,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import config from "@/config";
import TableFoods from "./tableFoods";
import Swal from "sweetalert2";
import TotalPrice from "./totalPrice";

export interface Foods {
  id: number;
  name: string;
  price: number;
  img?: string;
  foodCategory: string;
}

export interface SaleTemps {
  id: number;
  userId: number;
  tableNumber: number;
  SaleTempDetails: [
    {
      id: number;
      saleTempId: number;
      foodId: number;
      tasteId: number;
      foodSizeId: number;
      Food: [
        {
          id: number;
          name: string;
          price: number;
        }
      ];
    }
  ];
}

export default function TableDinner() {
  const [tableDinner, setTableDinner] = useState<number>(1);
  const [foods, setFoods] = useState<Foods[]>([]);
  const tableDinnerRef = useRef<HTMLInputElement>(null);
  const [saleTemps, setSaleTemps] = useState<SaleTemps[]>([]);

  useEffect(() => {
    fetchFoodsData();
    fetchDataSaleTemp();
    if (tableDinnerRef.current) {
      tableDinnerRef.current?.focus();
    }
  }, []);

  const fetchFoodsData = async () => {
    try {
      const res = await axios.get(`${config.apiServer}/api/foods/list`);
      if (res.data.results) {
        setFoods(res.data.results);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error Fetching Foods",
        text: error.message,
        icon: "error",
      });
    }
  };

  const filterFoods = async (foodCategory: string) => {
    try {
      const url =
        foodCategory === "all"
          ? `${config.apiServer}/api/foods/list`
          : `${config.apiServer}/api/foods/filter/${foodCategory}`;

      const res = await axios.get(url);
      setFoods(res.data.results);
    } catch (error: any) {
      Swal.fire({
        title: "Error Fetching Foods",
        text: error.message,
        icon: "error",
      });
    }
  };

  const fetchDataSaleTemp = async () => {
    try {
      const res = await axios.get(`${config.apiServer}/api/saleTemp/list`);
      setSaleTemps(res.data.results);
    } catch (error: any) {
      Swal.fire({
        title: "Error Fetching SaleTemp",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-5 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Label>Table number :</Label>
          <Input
            ref={tableDinnerRef}
            type="number"
            id="table-dinner"
            name="table-dinner"
            placeholder="Enter Table Number"
            value={tableDinner}
            onChange={(e) =>
              setTableDinner(Math.max(1, Number(e.target.value)))
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => filterFoods("food")}>
            <Badge
              variant="solid"
              color="primary"
              size="md"
              startIcon={<FontAwesomeIcon icon={faBurger} />}
            >
              Foods
            </Badge>
          </button>
          <button onClick={() => filterFoods("drink")}>
            <Badge
              variant="solid"
              color="success"
              size="md"
              startIcon={<FontAwesomeIcon icon={faMugHot} />}
            >
              Beverages
            </Badge>
          </button>
          <button onClick={() => filterFoods("all")}>
            <Badge
              variant="solid"
              color="info"
              size="md"
              startIcon={<FontAwesomeIcon icon={faList} />}
            >
              Both
            </Badge>
          </button>
          <button>
            <Badge
              variant="solid"
              color="error"
              size="md"
              startIcon={<FontAwesomeIcon icon={faTrashCan} />}
            >
              Clear
            </Badge>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4 bg-white dark:bg-black shadow-md p-4 rounded-lg">
          <TableFoods
            foods={foods}
            tableDinner={tableDinner}
            fetchDataSaleTemp={fetchDataSaleTemp}
          />
        </div>
        <div className="w-full md:w-1/4 bg-white dark:bg-black shadow-md p-4 rounded-lg">
          <TotalPrice saleTemps={saleTemps} />
        </div>
      </div>
    </div>
  );
}
