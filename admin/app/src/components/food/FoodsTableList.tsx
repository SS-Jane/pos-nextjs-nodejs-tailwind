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

export interface Foods {
  id: number;
  name: string;
  remark: string;
  img: string;
  price: number;
  status: string;
  foodCategory : string
  foodCategoryId: number;
  FoodCategories: FoodCategories;
}

export default function FoodsTableList() {
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState<Foods[]>([]);
  const [foodCategories, setFoodCategories] = useState<FoodCategories[]>([]);

  useEffect(() => {
    fetchDataFoodCategories();
    fetchDataFoods();
  }, []);

  const fetchDataFoods = async () => {
    try {
      const res = await axios.get(`${config.apiServer}/api/foods/list`);
      setFoods(res.data.results);
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

  const fetchDataFoodCategories = async () => {
    try {
      const res = await axios.get(
        `${config.apiServer}/api/foodCategories/list`
      );
      setFoodCategories(res.data.results);
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
          fetchDataFoodCategories={fetchDataFoodCategories}
          foodCategories={foodCategories}
          fetchDataFoods={fetchDataFoods}
        />
      </div>
      <ComponentCard title="Food categories table" className="mt-5">
        <BasicTable fetchDataFoods={fetchDataFoods} foods={foods} />
      </ComponentCard>
    </div>
  );
}
