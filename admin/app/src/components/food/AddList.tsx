"use client";

import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { PlusIcon } from "@/icons";
import { useModal } from "@/hooks/useModal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import axios from "axios";
import config from "@/config";
import { useState } from "react";
import Swal from "sweetalert2";
import Select from "../form/Select";
import Alert from "../ui/alert/Alert";
import { FoodCategories } from "./FoodsTableList";

interface AddListProps {
  foodCategories: FoodCategories[];
  fetchDataFoodCategories: () => Promise<void>;
  fetchDataFoods: () => Promise<void>;
}

export default function AddList({
  foodCategories,
  fetchDataFoods,
}: AddListProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [foodName, setFoodName] = useState("");
  const [foodRemark, setFoodRemark] = useState("");
  const [foodPrice, setFoodPrice] = useState(0);
  const [foodImg, setFoodImg] = useState("");
  const [myFiles, setMyFiles] = useState<File | null>(null);

  const [foodCategoryId, setFoodCategoryId] = useState<number | null>(null);

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
    if (foodPrice === null || isNaN(foodPrice)) {
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await handleUpload();
      const payload = {
        foodName: foodName,
        foodPrice: foodPrice,
        foodImg: foodImg,
        foodRemark: foodRemark,
        foodCategoryId: foodCategoryId,
      };

      const res = await axios.post(
        `${config.apiServer}/api/foods/create`,
        payload
      );

      if (res.data.messages === "success") {
        Swal.fire({
          target: document.querySelector(".modal-container"),
          title: "Add Food",
          html: `
              Add Food : <span class="text-green-500">${foodName}</span> success.
            `,
          icon: "success",
        });

        setTimeout(() => {
          closeModal();
          clearForm();
          fetchDataFoods();
        }, 2000);
      }
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Error message",
        text: error.messages,
        icon: "error",
      });
    }
  };

  const handleUpload = async (): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("myFiles", myFiles);

      const res = await axios.post(
        `${config.apiServer}/api/foods/upload`,
        formData
      );
      if (res.data.messages === "success") {
        setFoodImg(res.data.fileName);
      }
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Error message",
        text: error.messages,
        icon: "error",
      });
    }
  };

  const handleSelectedFile = (e) => {
    if (e.target.files.length > 0) {
      setMyFiles(e.target.files[0]);
    }
  };

  const clearForm = () => {
    setFoodName("");
    setFoodPrice(0);
    setFoodImg("");
    setFoodRemark("");
    setFoodCategoryId(null);
    setFoodImg("")
  };

  return (
    <div>
      <Button
        size="md"
        variant="primary"
        startIcon={<PlusIcon />}
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          openModal(),
            setAlert({
              show: false,
              variant: "info",
              title: "",
              message: "",
            });
          clearForm();
        }}
      >
        Add food
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="modal-container max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Food list
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
                  <Label>Food categories</Label>
                  <Select
                    options={foodCategories.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    placeholder="Select food categories"
                    onChange={(e) => setFoodCategoryId(parseInt(e))}
                    className="dark:bg-dark-900"
                  />
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
                    value={foodPrice !== null ? foodPrice : ""}
                    onChange={(e) => setFoodPrice(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label>Food image</Label>
                  <Input type="file" onChange={handleSelectedFile} />
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
