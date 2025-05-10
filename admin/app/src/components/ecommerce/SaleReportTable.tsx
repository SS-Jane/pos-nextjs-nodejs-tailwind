"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { CloseLineIcon, ListIcon } from "@/icons";
import Input from "../form/input/InputField";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";

// Define the table data using the interface

export default function SaleReportTable() {
  const [billSales, setBillSales] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [sumAmount, setSumAmount] = useState(0);
  const [billSaleDetails, setBillSaleDetails] = useState([]);
  const detailModal = useModal();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const payload = {
        startDate: new Date(fromDate),
        endDate: new Date(toDate),
      };

      const res = await axios.post(
        `${config.apiServer}/api/billSale/list`,
        payload
      );

      console.log("Bill Sale List", res.data);
      setBillSales(res.data.results);

      const sum = handleSumAmount(res.data.results);
      setSumAmount(sum);
    } catch (error: any) {
      Swal.fire({
        title: "Error Fetching Bill Sale list",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSumAmount = (rows: any) => {
    let sum = 0;
    rows.forEach((row: any) => {
      sum += row.amount;
    });
    return sum;
  };

  const handleCancelBill = async (id: number) => {
    try {
      const button = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "Do you want to cancel this bill?",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        await axios.delete(`${config.apiServer}/api/billSale/remove/${id}`);
        fetchData();
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error Cancelling Bill",
        text: error.message,
        icon: "error",
      });
    }
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        ตารางรายงานการขาย
      </h3>
      <div className="flex flex-row items-center space-x-2 my-2">
        <div>
          <p className="my-2 text-gray-500 text-theme-sm dark:text-gray-400">
            จากวันที่
          </p>
          <Input
            type="date"
            value={
              dayjs(fromDate).isValid()
                ? dayjs(fromDate).format("YYYY-MM-DD")
                : ""
            }
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              if (!isNaN(selectedDate.getTime())) {
                setFromDate(selectedDate);
              }
            }}
          />
        </div>
        <div>
          <p className="my-2 text-gray-500 text-theme-sm dark:text-gray-400">
            ถึงวันที่
          </p>
          <Input
            type="date"
            value={
              dayjs(toDate).isValid() ? dayjs(toDate).format("YYYY-MM-DD") : ""
            }
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              if (!isNaN(selectedDate.getTime())) {
                setToDate(selectedDate);
              }
            }}
          />
        </div>
        <div>
          <p className="my-2 text-gray-500 text-theme-sm dark:text-gray-400">
            &nbsp;
          </p>
          <button
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-3 py-2.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            onClick={fetchData}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} /> แสดงรายการ
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="w-full">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                >
                  ตัวเลือก
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                >
                  วันที่
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                >
                  รหัสบิล
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                >
                  พนังงานขาย
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                >
                  โต๊ะ
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                >
                  ยอดขาย
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {billSales.length > 0 &&
                billSales.map((billSale: any, index: number) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                  >
                    <TableCell className="flex flex-row justify-center items-center px-5 py-4 sm:px-6 text-center whitespace-nowrap min-w-max space-x-2">
                      <Button
                        size="sm"
                        variant="primary"
                        className="bg-error-500 hover:bg-error-600 "
                        onClick={() => handleCancelBill(billSale.id)}
                        startIcon={<CloseLineIcon className="h-5 w-5" />}
                      >
                        ยกเลิกบิล
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          console.log(
                            "Bill Sale Details",
                            billSale.BillSaleDetails
                          );
                          setBillSaleDetails(billSale.BillSaleDetails);
                          
                          detailModal.openModal();
                        }}
                        startIcon={<ListIcon className="h-5 w-5" />}
                      >
                        รายละเอียด
                      </Button>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-max">
                      {dayjs(billSale.payDate).format("YYYY-MM-DD HH:mm:ss")}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm  dark:text-gray-400 whitespace-nowrap min-w-max">
                      {billSale.id}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-max">
                      {billSale.User.fname}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm text-end dark:text-gray-400 whitespace-nowrap min-w-max">
                      {billSale.tableNumber}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm text-end dark:text-gray-400 whitespace-nowrap min-w-max">
                      {billSale.amount.toLocaleString("th-TH")}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <td
                  colSpan={5}
                  className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400"
                >
                  ยอดรวม
                </td>
                <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                  {sumAmount.toLocaleString("th-TH")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal
        isOpen={detailModal.isOpen}
        onClose={detailModal.closeModal}
        className="modal-detail max-w-[600px] p-5 lg:p-10"
      >
        <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
          รายละเอียดบิล
        </h4>

        <div className="max-w-full overflow-x-auto">
          <div className="w-full">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                  >
                    รายการ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                  >
                    ราคา
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                  >
                    รสชาติ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-max"
                  >
                    ขนาด
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {billSaleDetails.length > 0 &&
                  billSaleDetails.map((billSaleDetail: any, index: number) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                    >
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-max">
                        {billSaleDetail.Food.name}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm  dark:text-gray-400 whitespace-nowrap min-w-max">
                        {(
                          billSaleDetail.price + billSaleDetail.moneyAdded
                        ).toLocaleString("th-TH")}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-max">
                        {billSaleDetail.Taste?.name}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-gray-500 text-theme-sm text-end dark:text-gray-400 whitespace-nowrap min-w-max">
                        {billSaleDetail.foodSizeId &&
                          `${billSaleDetail.FoodSize?.name} + ${billSaleDetail.moneyAdded}`}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Modal>
    </div>
  );
}
