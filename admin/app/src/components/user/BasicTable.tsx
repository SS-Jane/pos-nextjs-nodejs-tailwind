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
import Alert from "../ui/alert/Alert";
import { UsersList } from "./UserTableList";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Select from "../form/Select";
import { cursorTo } from "readline";

interface BasicTableProps {
  fetchDataUsersList: () => Promise<void>;
  usersList: UsersList[];
  currentUserId: number;
}

export default function BasicTable({
  fetchDataUsersList,
  usersList,
  currentUserId,
}: BasicTableProps) {
  const [userId, setUserId] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [level, setLevel] = useState<string[]>(["admin", "user"]);
  const [levelSelected, setLevelSelected] = useState<string>("admin");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const editModal = useModal();
  const [showPassword, setShowPassword] = useState(false);
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

  const handleRemove = async (userIdParam: number) => {
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
          `${config.apiServer}/api/user/remove/${userIdParam}`
        );

        if (res.data.message === "success") {
          Swal.fire({
            title: "Remove Food Sizes",
            html: `
                Remove Food Sizes <span class="text-red-500">${userIdParam}</span> success
             `,
            icon: "success",
          });
        }
      }
      setTimeout(() => {
        fetchDataUsersList();
      }, 2000);
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
            editModal.closeModal();
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
          editModal.closeModal();
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

  const handleEdit = (userIdParam: number) => {
    setUserId(userIdParam);

    const user = usersList.find((item) => item.id === userIdParam);
    console.log("User", user);
    console.log("Username", user.username);
    setFirstName(user.fname);
    setLastName(user.lname);
    setUserName(user.username);
    setPassword(user.password);
    setEmail(user.email);
    setPhone(user.phone);
    setLevelSelected(user.level);
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
                  ชื่อ
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Username
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  ระดับผู้ใช้งาน
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  เบอร์โทร
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
              {usersList.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {user.fname} {user.lname}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.username}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.level}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.phone}
                    </TableCell>
                    <TableCell className="px-1 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex flex-1 flex-row justify-center items-center space-x-2">
                      {currentUserId !== user.id ? (
                        <>
                          <button
                            className="p-1 bg-blue-700 text-white flex items-center justify-center rounded-2xl"
                            onClick={() => {
                              handleEdit(user.id);
                              editModal.openModal();
                            }}
                          >
                            <PencilIcon height="20px" width="20px" />
                          </button>
                          <button
                            className="p-1 flex items-center justify-center bg-red-700 text-white rounded-2xl"
                            onClick={() => handleRemove(user.id)}
                          >
                            <TrashBinIcon height="20px" width="20px" />
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="modal-container max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {userId === 0 ? (
                "Create User"
              ) : (
                <>
                  Edit User : <span className="text-blue-500">{userName}</span>
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
                  <Label>First name</Label>
                  <Input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Last name</Label>
                  <Input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Username</Label>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      value={password}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                    Phone<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={phone}
                    placeholder="Enter your phone number"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Level</Label>
                  <Select
                    defaultValue={levelSelected}
                    options={level.map((item: string) => {
                      return {
                        label: item,
                        value: item,
                      };
                    })}
                    placeholder="Select Option"
                    onChange={(value) => setLevelSelected(value)}
                    className="dark:bg-dark-900"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={editModal.closeModal}
              >
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
