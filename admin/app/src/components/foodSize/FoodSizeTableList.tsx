"use client";

import BasicTable from "./BasicTable";
import ComponentCard from "../common/ComponentCard";
import AddList from "./AddList";
import axios from "axios";
import config from "@/config";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export interface FoodCategories {
  id: number;
  name: string;
  remark: string;
  status: string;
}

export interface FoodSize {
  id: number;
  name: string;
  remark: string;
  status: string;
  moneyAdded: number;
  foodCategoryId: number;
  FoodCategories: FoodCategories;
}

export default function FoodSizeTableList() {
  const [foodCategories, setFoodCategories] = useState<FoodCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [foodSizes, setFoodSizes] = useState<FoodSize[]>([]);

  useEffect(() => {
    fetchDataFoodCategories();
    fetchDataFoodSizes();
  }, []);

  const fetchDataFoodCategories = async () => {
    try {
      const res = await axios.get(
        `${config.apiServer}/api/foodCategories/list`
      );
      setFoodCategories(res.data.result);
    } catch (error: any) {
      Swal.fire({
        title: "Error message",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataFoodSizes = async () => {
    try {
      const res = await axios.get(`${config.apiServer}/api/foodSizes/list`);
      setFoodSizes(res.data.result);
    } catch (error: any) {
      Swal.fire({
        title: "Error message",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="p-2 rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <AddList
          foodCategories={foodCategories}
          fetchDataFoodCategories={fetchDataFoodCategories}
          fetchDataFoodSizes={fetchDataFoodSizes}
        />
      </div>
      <ComponentCard title="Food categories table" className="mt-5">
        <BasicTable
          fetchDataFoodSizes={fetchDataFoodSizes}
          foodSizes={foodSizes}
        />
      </ComponentCard>
    </div>
  );
}
