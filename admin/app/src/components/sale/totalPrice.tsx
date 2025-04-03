"use client";

import { useEffect, useState } from "react";
import { SaleTemps } from "./tableDinner";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/config";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import { PlusIcon } from "@/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import CalculateTotalPrice from "./CalculateTotalPrice";

interface TotalPriceProps {
  saleTemps: SaleTemps[];
  fetchDataSaleTemp: () => Promise<void>;
}

export default function TotalPrice({
  saleTemps,
  fetchDataSaleTemp,
}: TotalPriceProps) {
  const [saleTempDetails, setSaleTempDetails] = useState<any[]>([]);
  const [amount, setAmount] = useState(0);
  const { isOpen, openModal, closeModal } = useModal();
  const [tastes, setTastes] = useState("");
  const [sizes, setSizes] = useState("");
  const [amountAdded, setAmountAdded] = useState(0);
  const [saleTempId, setSaleTempId] = useState(0);


  useEffect(() => {
    console.log("Sale Temp is", saleTemps);
    sumAmount(saleTemps);
  }, [saleTemps]);

  const removeSaleTemp = async (id: number) => {
    try {
      const button = await Swal.fire({
        title: "Are you remove this list?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        await axios.delete(`${config.apiServer}/api/saleTemp/remove/${id}`);
        fetchDataSaleTemp();
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error Remove sale",
        text: error.message,
        icon: "error",
      });
    }
  };

  const updateQty = async (id: number, qty: number) => {
    try {
      const payload = {
        qty: qty,
        id: id,
      };

      await axios.put(`${config.apiServer}/api/saleTemp/updateQty`, payload);
      fetchDataSaleTemp();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const sumAmount = (saleTemps: any) => {
    let total = 0;
    saleTemps.forEach((item: any) => {
      total += item.Food.price * item.qty;
    });

    return setAmount(total);
  };

  const handleEdit = async (item: any) => {
    try {

      setSaleTempId(item.id);
      await generateSaleTempDetail(item.id);
      await fetchDataSaleTempInfo(item.id);
      openModal();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const generateSaleTempDetail = async (saleTempId: number) => {
    try {
      const payload = {
        saleTempId: saleTempId,
      };

      await axios.post(
        `${config.apiServer}/api/saleTemp/generateSaleTempDetail`,
        payload
      );
      await fetchDataSaleTemp();
      fetchDataSaleTempInfo(saleTempId);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const fetchDataSaleTempInfo = async (saleTempId: number) => {
    try {
      const res = await axios.get(
        `${config.apiServer}/api/saleTemp/info/${saleTempId}`
      );

      const data = res.data.results;

      if (data) {
        setSaleTempDetails(data.SaleTempDetails || []);
        setTastes(data.Food?.FoodCategories?.Tastes || []);
        setSizes(data.Food?.FoodCategories?.FoodSizes || []);
        sumAmount(data.SaleTempDetails);
        sumMoneyAdded(data.SaleTempDetails);
      } else {
        setSaleTempDetails([]);
        setTastes([]);
        setSizes([]);
        setAmount(0);
        setAmountAdded(0);
      }
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-edit-food"),
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const selectTaste = async (
    tasteId: number,
    saleTempDetailId: number,
    saleTempId: number
  ) => {
    try {
      const payload = {
        tasteId: tasteId,
        saleTempDetailId: saleTempDetailId,
      };

      await axios.put(`${config.apiServer}/api/saleTemp/selectTaste`, payload);
      await fetchDataSaleTempInfo(saleTempId);

      await fetchDataSaleTemp();
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-edit-food"),
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const unSelectTaste = async (
    saleTempDetailId: number,
    saleTempId: number
  ) => {
    try {
      const payload = {
        saleTempDetailId: saleTempDetailId,
      };

      await axios.put(
        `${config.apiServer}/api/saleTemp/unSelectTaste`,
        payload
      );
      await fetchDataSaleTempInfo(saleTempId);

      await fetchDataSaleTemp();
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".model-edit-food"),
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const selectSize = async (
    sizeId: number,
    saleTempDetailId: number,
    saleTempId: number
  ) => {
    try {
      const payload = {
        sizeId: sizeId,
        saleTempDetailId: saleTempDetailId,
      };

      axios.put(`${config.apiServer}/api/saleTemp/selectSize`, payload);
      await fetchDataSaleTempInfo(saleTempId);
      await fetchDataSaleTemp();
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-edit-food"),
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const unSelectSize = async (saleTempDetailId: number, saleTempId: number) => {
    try {
      const payload = {
        saleTempDetailId: saleTempDetailId,
      };
      axios.put(`${config.apiServer}/api/saleTemp/unSelectSize`, payload);
      await fetchDataSaleTempInfo(saleTempId);
      await fetchDataSaleTemp();
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-edit-food"),
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const sumMoneyAdded = (saleTempDetails: any) => {
    let sum = 0;

    saleTempDetails.forEach((detail: any) => {
      console.log(detail.FoodSize?.moneyAdded);
      sum += detail.FoodSize?.moneyAdded ?? 0;
    });

    setAmountAdded(sum);
  };

  const createSaleTempDetail = async () => {
    try {
      const payload = {
        saleTempId: saleTempId,
      };
      await axios.post(
        `${config.apiServer}/api/saleTemp/createSaleTempDetail`,
        payload
      );
      await fetchDataSaleTemp();
      fetchDataSaleTempInfo(saleTempId);
    } catch (error: any) {
      Swal.fire({
        target: document.querySelector(".modal-edit-food"),
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const removeSaleTempDetail = async(saleTempDetailId : number) => {
    try {
      const payload = {
        saleTempDetailId : saleTempDetailId
      }
      await axios.delete(`${config.apiServer}/api/saleTemp/removeSaleTempDetail`, {data : payload});
      await fetchDataSaleTemp();
      fetchDataSaleTempInfo(saleTempId)
    } catch (error : any) {
      Swal.fire({
        title : "error",
        text : error.message,
        icon : "error"
      })
    }
  }


  return (
    <div className=" dark:bg-black shadow-lg rounded-lg p-5 w-full max-w-md">
      <div className="bg-white dark:bg-black text-black dark:text-white font-semibold text-right p-4 rounded-lg text-2xl">
        ฿{(amount + amountAdded).toLocaleString("th-TH")}
      </div>
      <div className="mt-4 space-y-4">
        {saleTemps.length === 0 ? (
          <p className="text-gray-500 text-center">No items added.</p>
        ) : (
          saleTemps.map((item: any) => (
            <div
              className="flex flex-col border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 rounded-lg shadow-sm space-y-3"
              key={item.id}
            >
              <div>
                <h5 className="text-lg font-semibold text-gray-800   text-start dark:text-gray-200">
                  {item.Food.name}
                </h5>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {item.Food.price} x {item.qty} + {amountAdded} = ฿
                  <CalculateTotalPrice item={item}/>
                </p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Button
                  size="sm"
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  disabled={item.qty === 0 && item.saleTempDetails?.length > 0}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
                <Input
                  value={item.qty}
                  disabled
                  className="text-center w-10 bg-gray-200 rounded-md"
                />
                <Button
                  size="sm"
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  disabled={item.saleTempDetails?.length > 0}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>

              <div className="flex justify-between mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={(e) => removeSaleTemp(item.id)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => {
                    handleEdit(item);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        isFullscreen={true}
        className="modal-edit-food"
      >
        <div className="relative w-full p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900">
          <div className="border-b px-2 pr-14 pb-3">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit food details
            </h4>
          </div>

          <div className="mt-4 flex flex-col">
            <div>
              <Button
                size="md"
                variant="primary"
                startIcon={<PlusIcon />}
                onClick={createSaleTempDetail}
              >
                Add food list
              </Button>
            </div>
            <div className="table-container mt-4 overflow-auto">
              <Table className="w-full min-w-[300px] border rounded-lg">
                {/* Table Header */}
                <TableHeader className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                  <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-md dark:text-gray-400"
                    >
                      การจัดการ
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-md dark:text-gray-400"
                    >
                      Food name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-md dark:text-gray-400"
                    >
                      Taste
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-md dark:text-gray-400"
                    >
                      Size
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {saleTempDetails?.length > 0 ? (
                    saleTempDetails.map((detail: any) => (
                      <TableRow
                        key={detail.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <TableCell>
                          <button onClick={e =>removeSaleTempDetail(detail.id)}>ลบ</button>
                        </TableCell>
                        <TableCell className="px-6 py-4 sm:px-7 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {detail.Food?.name || "-"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {tastes.length > 0
                            ? tastes.map((taste: any) =>
                                detail.tasteId === taste.id ? (
                                  <button
                                    key={taste.id}
                                    className="px-2 py-2 mx-2 my-1 rounded-lg bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                                    onClick={(e) =>
                                      unSelectTaste(
                                        detail.id,
                                        detail.saleTempId
                                      )
                                    }
                                  >
                                    {taste.name}
                                  </button>
                                ) : (
                                  <button
                                    key={taste.id}
                                    className="px-2 py-2 mx-2 my-1 rounded-lg bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                                    onClick={(e) =>
                                      selectTaste(
                                        taste.id,
                                        detail.id,
                                        detail.saleTempId
                                      )
                                    }
                                  >
                                    {taste.name}
                                  </button>
                                )
                              )
                            : "-"}
                        </TableCell>

                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {sizes.length > 0
                            ? sizes.map((size: any) =>
                                detail.foodSizeId === size.id ? (
                                  <button
                                    key={size.id}
                                    className="px-2 py-2 mx-2 my-1 rounded-lg bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                                    onClick={(e) =>
                                      unSelectSize(detail.id, detail.saleTempId)
                                    }
                                  >
                                    +{size.moneyAdded} {size.name}
                                  </button>
                                ) : (
                                  <button
                                    key={size.id}
                                    className="px-2 py-2 mx-2 my-1 rounded-lg bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                                    onClick={(e) =>
                                      selectSize(
                                        size.id,
                                        detail.id,
                                        detail.saleTempId
                                      )
                                    }
                                  >
                                    +{size.moneyAdded} {size.name}
                                  </button>
                                )
                              )
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-gray-500 py-4"
                      >
                        No items available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
