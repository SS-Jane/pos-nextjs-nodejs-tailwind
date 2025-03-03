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
import { Foods } from "./FoodsTableList";
import Alert from "../ui/alert/Alert";
import Image from "next/image";
import FileInput from "../form/input/FileInput";
import Radio from "../form/input/Radio";

interface BasicTableProps {
  fetchDataFoods: () => Promise<void>;
  foods: Foods[];
}

export default function BasicTable({ fetchDataFoods, foods }: BasicTableProps) {
  const [foodId, setFoodId] = useState(0);
  const [foodName, setFoodName] = useState("");
  const [foodRemark, setFoodRemark] = useState("");
  const [foodImg, setFoodImg] = useState("");
  const [myFiles, setMyFiles] = useState<File | null>(null);
  const [foodPrice, setFoodPrice] = useState(0);
  const { isOpen, openModal, closeModal } = useModal();
  const [foodCategoryName, setFoodCategoryName] = useState("");
  const [foodCategoryId, setFoodCategoryId] = useState(0);
  const [foodCategory, setFoodCategory] = useState("food");
  const [alert, setAlert] = useState({
    show: false,
    variant: "info" as "warning" | "error" | "success" | "info",
    title: "",
    message: "",
  });

  const validateForm = (): boolean => {
    if (!foodCategoryId) {
      setAlert({
        show: true,
        variant: "warning",
        title: "Validation error",
        message: "Please select a food category.",
      });
      return false;
    }

    if (!foodName.trim()) {
      setAlert({
        show: true,
        variant: "warning",
        title: "validation error",
        message: "Food name is required.",
      });
      return false;
    }
    if (foodPrice === null || "") {
      setAlert({
        show: true,
        variant: "warning",
        title: "validation error",
        message: "Price of food is required.",
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

  const handleRemove = async (item: Foods) => {
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
          `${config.apiServer}/api/foods/remove/${item.id}`
        );
        if (res.data.message === "success") {
          Swal.fire({
            title: "Remove Food",
            html: `Remove Food : <span class="text-red-500">${item.name}</span> success`,
            icon: "success",
          });
          setTimeout(() => {
            fetchDataFoods();
          }, 2000);
        }
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const uploadedImg = myFiles ? await handleUpload() : foodImg;

      const payload = {
        foodCategoriesId: foodCategoryId,
        foodId: foodId,
        foodName: foodName,
        foodRemark: foodRemark,
        foodImg: uploadedImg,
        foodPrice: foodPrice,
        foodCategory: foodCategory,
      };

      if (foodId == 0) {
        const res = await axios.post(
          `${config.apiServer}/api/foods/create`,
          payload
        );
        if (res.data.message === "success") {
          Swal.fire({
            target: document.querySelector(".modal-container"),
            title: "Add Food Taste",
            html: `Food Taste : <span class="text-green-500">${foodName}</span> added successfully.`,
            icon: "success",
          });
          clearForm();
        }
      } else {
        const res = await axios.put(
          `${config.apiServer}/api/foods/update`,
          payload
        );
        if (res.data.message === "success") {
          Swal.fire({
            target: document.querySelector(".modal-container"),
            title: "Edit Food Categories",
            html: `Add Food Categories : <span class="text-green-500">${foodName}</span> success`,
            icon: "success",
          });
        }
        setTimeout(() => {
          clearForm();
          closeModal();
          fetchDataFoods();
        }, 2000);
      }
    } catch (error: unknown) {
      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Error!",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleUpload = async (): Promise<string | null> => {
    try {
      if (!myFiles) {
        return foodImg;
      }

      const formData = new FormData();
      formData.append("myFiles", myFiles);

      const res = await axios.post(
        `${config.apiServer}/api/foods/upload`,
        formData
      );

      if (res.data.fileName) {
        return res.data.fileName;
      } else {
        return foodImg;
      }
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Error message",
        text: error.message,
        icon: "error",
      });
      return foodImg;
    }
  };

  const edit = (item: Foods) => {
    setFoodId(item.id);
    setFoodName(item.name);
    setFoodRemark(item.remark);
    setFoodPrice(item.price);
    setFoodCategoryName(item.FoodCategories.name);
    setFoodCategoryId(item.FoodCategories.id);
    setFoodImg(item.img);
    setMyFiles(null);
  };

  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setMyFiles(file);

      const imageUrl = URL.createObjectURL(file);
      setFoodImg(imageUrl);
    }
  };

  const clearForm = () => {
    setFoodId(0);
    setFoodName("");
    setFoodRemark("");
    setFoodImg("");
    setFoodPrice(0);
    setMyFiles(null);
  };

  const showImage = (food: Foods) => {
    if (!food || !food.img) {
      return (
        <Image
          src={`${config.apiServer}/uploads/default-image.webp`}
          alt="Default image"
          width={100}
          height={100}
        />
      );
    }

    return (
      <Image
        src={`${config.apiServer}/uploads/${food.img}`}
        alt={food.name}
        width={100}
        height={100}
      />
    );
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
                  Food categories
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Food category
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Food name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Price
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Image
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
              {foods.map((food) => {
                return (
                  <TableRow key={food.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {food.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {food.FoodCategories.name || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {food.foodCategory || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {food.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text- start text-theme-sm dark:text-gray-400">
                      {food.price}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {showImage(food)}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {food.remark || "-"}
                    </TableCell>
                    <TableCell className="px-1 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex flex-1 flex-row justify-center items-center space-x-2">
                      <button
                        className="p-1 bg-blue-700 text-white flex items-center justify-center rounded-2xl"
                        onClick={(item: Foods) => {
                          edit(food);
                          openModal();
                        }}
                      >
                        <PencilIcon height="20px" width="20px" />
                      </button>
                      <button
                        className="p-1 flex items-center justify-center bg-red-700 text-white rounded-2xl"
                        onClick={(e) => handleRemove(food)}
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
              {foodId === 0 ? (
                "Add Food name"
              ) : (
                <>
                  Edit Food :{" "}
                  <span className="text-blue-500">{foodCategoryName}</span>
                </>
              )}
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
                  <Label>Food category</Label>
                  <div>
                    <Radio
                      id="foodCategory-food"
                      name="foodCategory"
                      value="food"
                      checked={foodCategory === "food"}
                      onChange={() => setFoodCategory("food")}
                      label="Food"
                    />
                    <Radio
                      id="foodCategory-drink"
                      name="foodCategory"
                      value="drink"
                      checked={foodCategory === "drink"}
                      onChange={() => setFoodCategory("drink")}
                      label="Drink"
                    />
                  </div>
                </div>
                <div>
                  <Label>Food name</Label>
                  <Input
                    type="text"
                    placeholder="Food name"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Food price</Label>
                  <Input
                    type="number"
                    placeholder="Price of food"
                    value={foodPrice !== null ? foodPrice : "0"}
                    onChange={(e) => setFoodPrice(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label>Food image</Label>
                  <FileInput onChange={handleSelectedFile} />
                  <div className="mt-2">
                    {myFiles ? (
                      <Image
                        src={URL.createObjectURL(myFiles)}
                        alt="Preview"
                        height={100}
                        width={100}
                      />
                    ) : foodImg ? (
                      <Image
                        src={`${config.apiServer}/uploads/${foodImg}`}
                        alt="Existing"
                        height={100}
                        width={100}
                      />
                    ) : (
                      <Image
                        src={`${config.apiServer}/uploads/default-image.webp`}
                        alt="Default"
                        height={100}
                        width={100}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label>Remark</Label>
                  <Input
                    type="text"
                    value={foodRemark}
                    onChange={(e) => setFoodRemark(e.target.value)}
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
            <div className="mt-5">
              {alert.show && (
                <Alert
                  variant={alert.variant}
                  title={alert.title}
                  message={alert.message}
                />
              )}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
