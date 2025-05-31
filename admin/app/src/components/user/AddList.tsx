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

interface AddListProps {
  fetchDataUsersList: () => Promise<void>;
}

export default function AddList({ fetchDataUsersList }: AddListProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const [userId, setUserId] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [level, setLevel] = useState<string[]>(["admin", "user"]);
  const [levelSelected, setLevelSelected] = useState<string>("admin");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [alert, setAlert] = useState({
    show: false,
    variant: "info" as "warning" | "error" | "success" | "info",
    title: "",
    message: "",
  });

  const validateForm = (): boolean => {
    if (!firstName.trim() || !lastName.trim()) {
      setAlert({
        show: true,
        variant: "warning",
        title: "Validation Error",
        message: "First and last names are required!",
      });
      return false;
    }
    if (!userName.trim()) {
      setAlert({
        show: true,
        variant: "warning",
        title: "Validation Error",
        message: "Username is required!",
      });
      return false;
    }
    if (password.length < 6) {
      setAlert({
        show: true,
        variant: "warning",
        title: "Validation Error",
        message: "Password must be at least 6 characters!",
      });
      return false;
    }
    if (!email.includes("@")) {
      setAlert({
        show: true,
        variant: "warning",
        title: "Validation Error",
        message: "Enter a valid email address!",
      });
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setAlert({
        show: true,
        variant: "warning",
        title: "Validation Error",
        message: "Phone number must be 10 digits!",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        id: userId,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        password: password,
        email: email,
        phone: phone,
        level: levelSelected,
      };

      if (userId == 0) {
        const res = await axios.post(
          `${config.apiServer}/api/foodSizes/create`,
          payload
        );
        if (res.data.message === "success") {
          Swal.fire({
            target: document.querySelector(".modal-container"),
            title: "Create User",
            html: `
                Food Size <span class="text-green-500">${userName}</span> added successfully.
             `,
            icon: "success",
          });
          setTimeout(() => {
            clearForm();
            closeModal();
            fetchDataUsersList();
          }, 2000);
        }
      } else {
        const res = await axios.put(
          `${config.apiServer}/api/foodSizes/update`,
          payload
        );
        if (res.data.message === "success") {
          Swal.fire({
            target: document.querySelector(".modal-container"),
            title: "Edit User",
            html: `Add Food Categories <span class="text-green-500">${userName}</span> success`,
            icon: "success",
          });
        }
        setTimeout(() => {
          clearForm();
          closeModal();
          fetchDataUsersList();
        }, 2000);
      }
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-container"),
        title: "Error!",
        text: error.message,
        icon: "error",
      });
    }
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setUserName("");
    setPassword("");
    setEmail("");
    setPhone("");
    setLevelSelected("admin");
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
        Create user
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="modal-container max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Create user
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
                    options={lavel.map((item) => ({
                      value: item,
                      label: item,
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
                    value={moneyAdd !== null ? moneyAdd : "0"}
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
