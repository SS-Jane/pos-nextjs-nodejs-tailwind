"use client";

import BasicTable from "./BasicTable";
import ComponentCard from "../common/ComponentCard";
import AddList from "./AddList";
import axios from "axios";
import config from "@/config";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export interface FoodCategory {
  id: number;
  name : string;
  remark : string;
  status : string;
}



export default function CategoriesTableList() {
  const [foodCategories, setFoodCategories] = useState<FoodCategory>([]);
    const [loading, setLoading] = useState(true);

    const fetchDataFoodCategories = async () => {
      try {
        const res = await axios.get(
          `${config.apiServer}/api/foodCategories/list`
        );
  
        setFoodCategories(res.data.result);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchDataFoodCategories();
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }

  return (
    <div>
    <div className="p-2 rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <AddList fetchData ={fetchDataFoodCategories} />
    </div>

    <ComponentCard title="Food categories table" className="mt-5">
      <BasicTable foodCategories={foodCategories} fetchData={fetchDataFoodCategories} />
    </ComponentCard>
  </div>
  );
}