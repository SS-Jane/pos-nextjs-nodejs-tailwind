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
import { FoodCategory } from "./CategoriesTableList";

interface BasicTableProps {
  foodCategories: FoodCategory[];
  fetchData: () => Promise<void>;
}

export default function BasicTable({
  foodCategories=[],
  fetchData,
}: BasicTableProps) {
  const [id, setId] = useState(0);
  const [categoriesName, setCategoriesName] = useState("");
  const [categoriesRemark, setCategoriesRemark] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [alert, setAlert] = useState({
      show: false,
      variant: "info" as "warning" | "error" | "success" | "info",
      title: "",
      message: "",
    });


  const validateForm = (): boolean => {
    if (!categoriesName) {
      setAlert({
        show: true,
        variant: "warning",
        title: "Validation error",
        message: "Please select a food category.",
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


  const handleRemove = async (item: any) => {
    try {
      const button = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to remove this item?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.delete(
          `${config.apiServer}/api/foodCategories/remove/${item.id}`
        );
        if (res.data.message === "success") {
          Swal.fire({
            title: "Remove Food Categories",
            html: `Remove Food Categories: <span class="text-red-500">${item.name}</span> success`,
            icon: "success",
          });
        }
      }
      setTimeout(() => {
        fetchData();
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
        id: id,
        categoriesName: categoriesName,
        categoriesRemark: categoriesRemark,
      };

      if (id == 0) {
        const res = await axios.post(
          `${config.apiServer}/api/foodCategories/create`,
          payload
        );
        if (res.data.message === "success") {
          Swal.fire({
            target: document.querySelector(".modal-container"),
            title: "Add Food Categories",
            html: `Add Food Categories <span class="text-green-500">${categoriesName}</span> success`,
            icon: "success",
          });

          setTimeout(() => {
            clearForm();
            closeModal();
            fetchData();
          }, 2000);
        }
      } else {
        const res = await axios.put(
          `${config.apiServer}/api/foodCategories/update`,
          payload
        );
        if (res.data.message === "success") {
          Swal.fire({
            target: document.querySelector(".modal-container"),
            title: "Edit Food Categories",
            html: `Add Food Categories <span class="text-green-500">${categoriesName}</span> success`,
            icon: "success",
          });
        }
        setTimeout(() => {
          clearForm();
          closeModal();
          fetchData();
        }, 2000);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
      });
    }
  };

  const edit = (item: any) => {
    setId(item.id);
    setCategoriesName(item.name);
    setCategoriesRemark(item.remark);
  };

  const clearForm = () => {
    setId(0);
    setCategoriesName("");
    setCategoriesRemark("");
  };

  if (!foodCategories) {
    return <p>Loading categories...</p>;
  }

  

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
                  Category name
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
              {foodCategories?.map((category: any) => (
                <TableRow key={category.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {category.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {category.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {category.remark || "-"}
                  </TableCell>
                  <TableCell className="px-1 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex flex-1 flex-row justify-center items-center space-x-2">
                    <button
                      className="p-1 bg-blue-700 text-white flex items-center justify-center rounded-2xl"
                      onClick={(item: FoodCategory) => {
                        edit(category);
                        openModal();
                      }}
                    >
                      <PencilIcon height="20px" width="20px" />
                    </button>
                    <button
                      className="p-1 flex items-center justify-center bg-red-700 text-white rounded-2xl"
                      onClick={(e) => handleRemove(category)}
                    >
                      <TrashBinIcon height="20px" width="20px" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
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
              {id === 0 ? "Add Food size" : "Edit Food Size"}
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
                  <Label>Food categories name</Label>
                  <Input
                    type="text"
                    placeholder="Food categories name"
                    value={categoriesName}
                    onChange={(e) => setCategoriesName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Remark</Label>
                  <Input
                    type="text"
                    value={categoriesRemark}
                    onChange={(e) => setCategoriesRemark(e.target.value)}
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
        </div>
      </Modal>
    </div>
  );
}
