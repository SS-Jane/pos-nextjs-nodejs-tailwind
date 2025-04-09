"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextAreaInput from "../form/form-elements/TextAreaInput";
import TextArea from "../form/input/TextArea";

interface UserInfoCardProps {
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
  promtpay: string;
  setPromtpay: (promtpay: string) => void;
  taxCode: string;
  setTaxCode: (taxCode: string) => void;
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  setAddress: (address: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }) => void;
}

export default function UserInfoCard({
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
  website,
  setWebsite,
  promtpay,
  setPromtpay,
  taxCode,
  setTaxCode,
  address,
  setAddress,
}: UserInfoCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            ข้อมูลร้านค้า
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
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
                {address.address},{address.city},{address.state},
                {address.country},{address.zipCode}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Promtpay
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {promtpay}
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

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <form className="flex flex-col">
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
                    <Label>Phone</Label>
                    <Input
                      type="text"
                      value={phone}
                      placeholder="phone"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input
                      type="text"
                      value={email}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Website</Label>
                    <Input
                      type="text"
                      value={website}
                      placeholder="Website"
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Address</Label>
                    <TextArea
                      rows={6}
                      value={address.address}
                      placeholder="Address"
                      onChange={(e) =>
                        setAddress({ ...address, address: e.target.value })
                      }
                    />

                    <Label>City</Label>
                    <Input
                      type="text"
                      value={address.city}
                      placeholder="City"
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                    />

                    <Label>State</Label>
                    <Input
                      type="text"
                      value={address.state}
                      placeholder="State"
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                    />

                    <Label>County</Label>
                    <Input
                      type="text"
                      value={address.country}
                      placeholder="County"
                      onChange={(e) =>
                        setAddress({ ...address, country: e.target.value })
                      }
                    />

                    <Label>Zip code</Label>
                    <Input
                      type="text"
                      value={address.zipCode}
                      placeholder="Zip code"
                      onChange={(e) =>
                        setAddress({ ...address, zipCode: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>PromtPay</Label>
                    <Input
                      type="text"
                      value={promtpay}
                      placeholder="Promtpay"
                      onChange={(e) => setPromtpay(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
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
