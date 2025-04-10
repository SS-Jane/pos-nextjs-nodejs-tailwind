"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/config";

interface UserInfoCardProps {
  id: number;
  setId: (id: number) => void;
  name: string;
  setName: (name: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  email: string;
  setEmail: (email: string) => void;
  website: string;
  setWebsite: (website: string) => void;
  logo: string;
  setLogo: (logo: string) => void;
  promptpay: string;
  setPromtpay: (promptpay: string) => void;
  taxCode: string;
  setTaxCode: (taxCode: string) => void;
  address: {
    address: string;
    subDistrict: string;
    district: string;
    province: string;
    zipCode: string;
  };
  setAddress: (address: {
    address: string;
    subDistrict: string;
    district: string;
    province: string;
    zipCode: string;
  }) => void;
}

export default function UserInfoCard({
  id,
  setId,
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
  website,
  setWebsite,
  promptpay,
  setPromtpay,
  taxCode,
  setTaxCode,
  address,
  setAddress,
}: UserInfoCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = async () => {
    try {
      const payload = {
        name,
        address: JSON.stringify({
          address: address.address,
          subDistrict: address.subDistrict,
          district: address.district,
          province: address.province,
          zipCode: address.zipCode,
        }),
        phone,
        email,
        website,
        promptpay,
        taxCode,
      };

      const res = await axios.post(
        `${config.apiServer}/api/organization/create`,
        payload
      );

      if (res.data.message === "success") {
        Swal.fire({
          target: document.querySelector(".modal-information"),
          title: "Add Organization",
          text: "Add Organization success",
          icon: "success",
          timer: 2000,
        });
      }
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-information"),
        icon: "error",
        title: "Error",
        text: error.message,
        timer: 2000,
      });
    }
    closeModal();
  };

  const clearForm = () => {
    setId(0);
    setName("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setPromtpay("");
    setTaxCode("");
    setAddress({
      address: "",
      subDistrict: "",
      district: "",
      province: "",
      zipCode: "",
    });
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            ข้อมูลร้านค้า
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32 mt-5">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                ชื่อร้านค้า
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {phone}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Website
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {website}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {address.address},{address.subDistrict},{address.district},
                {address.province},{address.zipCode}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Promtpay
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {promptpay}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tax code
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {taxCode}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] m-4 modal-information"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <form className="flex flex-col" onSubmit={(e)=>{
            e.preventDefault();
            handleSave();
          }}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                  Update your details to keep your information up-to-date.
                </p>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>ชื่อร้านค้า</Label>
                    <Input
                      type="text"
                      value={name}
                      placeholder="ชื่อร้านค้า"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>เบอร์โทร</Label>
                    <Input
                      type="text"
                      value={phone}
                      placeholder="เบอร์โทร"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>อีเมล</Label>
                    <Input
                      type="text"
                      value={email}
                      placeholder="อีเมล"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>เว็บไซต์</Label>
                    <Input
                      type="text"
                      value={website}
                      placeholder="เว็บไซต์"
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>ที่อยู่</Label>
                    <TextArea
                      rows={6}
                      value={address.address}
                      placeholder="ที่อยู่"
                      onChange={(value) =>
                        setAddress({ ...address, address: value })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>ตำบล/แขวง</Label>
                    <Input
                      type="text"
                      value={address.subDistrict}
                      placeholder="ตำบล/แขวง"
                      onChange={(e) =>
                        setAddress({ ...address, subDistrict: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>อำเภอ/เขต</Label>
                    <Input
                      type="text"
                      value={address.district}
                      placeholder="อำเภอ/เขต"
                      onChange={(e) =>
                        setAddress({ ...address, district: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>จังหวัด</Label>
                    <Input
                      type="text"
                      value={address.province}
                      placeholder="จังหวัด"
                      onChange={(e) =>
                        setAddress({ ...address, province: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>รหัสไปรษณีย์</Label>
                    <Input
                      type="text"
                      value={address.zipCode}
                      placeholder="รหัสไปรษณีย์"
                      onChange={(e) =>
                        setAddress({ ...address, zipCode: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>PromtPay</Label>
                    <Input
                      type="text"
                      value={promptpay}
                      placeholder="เลขบัญชี PromtPay"
                      onChange={(e) => setPromtpay(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Tax code</Label>
                    <Input
                      type="text"
                      value={taxCode}
                      placeholder="Tax code"
                      onChange={(e) => setTaxCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
