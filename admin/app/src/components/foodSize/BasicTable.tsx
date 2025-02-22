"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import axios from "axios";
import config from "@/config";
import Swal from "sweetalert2";
import { PencilIcon, TrashBinIcon } from "@/icons";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { FoodCategory, FoodSize } from "./FoodSizeTableList";
import Alert from "../ui/alert/Alert";

interface BasicTableProps {
  foodCategories: FoodCategory[];
  fetchDataFoodSizes: () => Promise<void>;
  foodSizes: FoodSize[];
}

export default function BasicTable({
  foodCategories,
  fetchDataFoodSizes,
  foodSizes,
}: BasicTableProps) {
  const [foodSizeId, setFoodSizeId] = useState(0);
  const [foodSizeName, setFoodSizeName] = useState("");
  const [foodSizeRemark, setFoodSizeRemark] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [foodCategoriesName, setFoodCategoriesName] = useState("");
  const [foodCategoriesId, setFoodCategoriesId] = useState(0);
  const [moneyAdd, setMoneyAdd] = useState<number | null>(null);
  const [alert, setAlert] = useState({
    show: false,
    variant: "info" as "warning" | "error" | "success" | "info",
    title: "",
    message: "",
  });

  
  const validateForm = (): boolean => {
    if (!foodCategoriesId) {
      setAlert({
        show: true,
        variant: "warning",
        title: "Validation error",
        message: "Please select a food category.",
      });
      return false;
    }

    if (!foodSizeName.trim()) {
      setAlert({
        show: true,
        variant: "warning",
        title: "validation error",
        message: "Food size name is required.",
      });
      return false;
    }
    if (moneyAdd === null || isNaN(moneyAdd)) {
      setAlert({
        show: true,
        variant: "warning",
        title: "Validation error",
        message: "Please enter an amount for additional money.",
      });
      return false;
    }
    setAlert({
      show: false,
      variant: "info",
      title: "",
      message: "",
    });
    return true;
  };

  const handleRemove = async (item: FoodSize) => {
    try {
      const button = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to remove this item?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        await axios.delete(
          `${config.apiServer}/api/foodSizes/remove/${item.id}`
        );
        Swal.fire({
          title: "Remove Food Sizes",
          text: `Remove Food Sizes ${item.name} success`,
          icon: "success",
        });
      }
      setTimeout(() => {
        fetchDataFoodSizes();
      }, 2000);
    } catch (e: any) {
      Swal.fire({
        title: "Error!",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        foodCategoriesId : foodCategoriesId,
        foodSizeId: foodSizeId,
        foodSizeName: foodSizeName,
        foodSizeRemark: foodSizeRemark,
        moneyAdd: moneyAdd,

      };

      if (foodSizeId == 0) {
        await axios.post(`${config.apiServer}/api/foodSizes/create`, payload);
        Swal.fire({
          target: document.querySelector(".modal-container"),
          title: "Add Food size",
          text: `Food Size "${foodSizeName}" added successfully.`,
          icon: "success",
        });
        clearForm();
      } else {
        await axios.put(`${config.apiServer}/api/foodSizes/update`, payload);
        setFoodSizeId(0);
        Swal.fire({
          target: document.querySelector(".modal-container"),
          title: "Edit Food Categories",
          text: `Add Food Categories ${foodSizeName} and ${foodSizeRemark} success`,
          icon: "success",
        });
      }
      setTimeout(() => {
        closeModal();
        fetchDataFoodSizes();
      }, 2000);
    } catch (error: unknown) {
      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Error!",
        text: error.message,
        icon: "error",
      });
    }
  };

  const edit = (item: FoodSize) => {
    setFoodSizeId(item.id);
    setFoodSizeName(item.name);
    setFoodSizeRemark(item.remark);
    setMoneyAdd(item.moneyAdded);
    const category = foodCategories.find(
      (cat) => cat.id === item.foodCategoryId
    );
    if (category) {
      setFoodCategoriesName(category.name);
      setFoodCategoriesId(category.id);
    }
  };

  const clearForm = () => {
    setFoodSizeId(0);
    setFoodSizeName("");
    setFoodSizeRemark("");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Food category name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Food size name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Add more price
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Remark
                </TableCell>
                <TableCell
                  isHeader
                  className="px-1 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {foodSizes.map((foodSize) => {
                const category = foodCategories.find(
                  (cat) => cat.id === foodSize.foodCategoryId
                );
                return (
                  <TableRow key={foodSize.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {foodSize.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {category ? category.name : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {foodSize.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {foodSize.moneyAdded}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {foodSize.remark || "-"}
                    </TableCell>
                    <TableCell className="px-1 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex flex-1 flex-row justify-center items-center space-x-2">
                      <button
                        className="p-1 bg-blue-700 text-white flex items-center justify-center rounded-2xl"
                        onClick={(item : FoodSize) => {
                          edit(foodSize);
                          openModal();
                        }}
                      >
                        <PencilIcon height="20px" width="20px" />
                      </button>
                      <button
                        className="p-1 flex items-center justify-center bg-red-700 text-white rounded-2xl"
                        onClick={(e) => handleRemove(foodSize)}
                      >
                        <TrashBinIcon height="20px" width="20px" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="modal-container max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {foodSizeId === 0
                ? "Add Food size"
                : `Edit Food Size : ${foodCategoriesName}`}
            </h4>
          </div>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Food size name</Label>
                  <Input
                    type="text"
                    placeholder="Food categories name"
                    value={foodSizeName}
                    onChange={(e) => setFoodSizeName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Add more money for add size</Label>
                  <Input
                    type="number"
                    placeholder="add more price"
                    value={moneyAdd !== null ? moneyAdd : ""}
                    onChange={(e) => setMoneyAdd(parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label>Remark</Label>
                  <Input
                    type="text"
                    value={foodSizeRemark}
                    onChange={(e) => setFoodSizeRemark(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Save
              </Button>
            </div>
          </form>
          <div className="mt-5">
              {alert.show && (
                <Alert
                  variant={alert.variant}
                  title={alert.title}
                  message={alert.message}
                />
              )}
            </div>
        </div>
      </Modal>
    </div>
  );
}
