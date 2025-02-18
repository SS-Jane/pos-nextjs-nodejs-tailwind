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
import Alert from "../ui/alert/Alert";

export default function AddList() {
  const { isOpen, openModal, closeModal } = useModal();
  const [categoriesName, setCategoriesName] = useState("");
  const [categoriesRemark, setCategoriesRemake] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    variant: "info" as "warning" | "error" | "success" | "info",
    title: "",
    message: "",
  });

  const handleSave = async () => {
    try {
      const payload = {
        categoriesName: categoriesName,
        categoriesRemark: categoriesRemark,
      };

      await axios.post(
        `${config.apiServer}/api/foodCategories/create`,
        payload
      );

      setAlert({
        show: true,
        variant: "success",
        title: "Add Food Categories",
        message: `Add Food Categories ${categoriesName} success`,
      });

      setTimeout(() => {
        closeModal();
      }, 3000);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        const customMessage = error.message.includes("401")
          ? "invalid username or password"
          : error.message;
        setAlert({
          show: true,
          variant: "error",
          title: "Error message",
          message: customMessage,
        });
      } else {
        setAlert({
          show: true,
          variant: "error",
          title: "Error message",
          message: "An unknown error occurred",
        });
      }
    }
  };

  return (
    <div>
      <Button
        size="md"
        variant="primary"
        startIcon={<PlusIcon />}
        onClick={openModal}
      >
        Add Food categories
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Food categories list
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Food categories name</Label>
                  <Input
                    type="text"
                    placeholder="Food categories name"
                    defaultValue={categoriesName}
                    onChange={(e) => setCategoriesName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Remark</Label>
                  <Input
                    type="text"
                    defaultValue={categoriesRemark}
                    onChange={(e) => setCategoriesRemake(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
            <div>
              {" "}
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
