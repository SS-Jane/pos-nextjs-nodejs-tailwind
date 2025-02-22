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
import Swal from "sweetalert2";

interface AddListProps {
  fetchData: () => Promise<void>;
}

export default function AddList({fetchData}: AddListProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [categoriesName, setCategoriesName] = useState("");
  const [categoriesRemark, setCategoriesRemark] = useState("");
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

      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Add Food categories",
        text: `Add Food categories : ${categoriesName} success`,
        icon: "success",
      });

      setTimeout(() => {
        closeModal();
        clearForm();
        fetchData();
      }, 1000);
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Error message",
        text: error.message,
        icon: "error",
      });
    }
  };

  const clearForm = () =>{
    setCategoriesName("");
    setCategoriesRemark("");
  }

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

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="modal-container max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Food categories list
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
