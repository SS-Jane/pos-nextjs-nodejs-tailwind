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
import { FoodCategory } from "./FoodSizeTableList";

interface AddListProps {
  foodCategories: FoodCategory[];
  fetchDataFoodCategories: () => Promise<void>;
  fetchDataFoodSizes: () => Promise<void>;
}

export default function AddList({ foodCategories,fetchDataFoodSizes }: AddListProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const [foodSizeName, setFoodSizeName] = useState("");
  const [foodSizeRemark, setFoodSizeRemark] = useState("");

  const [moneyAdd, setMoneyAdd] = useState<number | null>(null);

  const [foodCategoryId, setFoodCategoryId] = useState<number | null>(
    foodCategories[0]?.id || null
  );

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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        foodSizeName: foodSizeName,
        foodSizeRemark: foodSizeRemark,
        foodCategoryId: foodCategoryId,
        moneyAdd: moneyAdd,
      };

      await axios.post(`${config.apiServer}/api/foodSizes/create`, payload);

      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Add Food Size",
        text: `Add Food Size : ${foodSizeName} success`,
        icon: "success",
      });

      setTimeout(() => {
        closeModal();
        clearForm();
        fetchDataFoodSizes();
      }, 2000);
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Error message",
        text: error.message,
        icon: "error",
      });
    }
  };

  const clearForm = () => {
    setFoodSizeName("");
    setFoodSizeRemark("");
    setMoneyAdd(null);
    setFoodCategoryId(foodCategories[0]?.id || null);
  }

  return (
    <div>
      <Button
        size="md"
        variant="primary"
        startIcon={<PlusIcon />}
        onClick={openModal}
      >
        Add size of food
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="modal-container max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Food size list
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
                  <Label>Food size name</Label>
                  <Input
                    type="text"
                    placeholder="Food size"
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
