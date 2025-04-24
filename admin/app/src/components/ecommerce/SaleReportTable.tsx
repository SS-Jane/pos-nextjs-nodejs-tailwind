"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/config";

export default function SaleReportTable() {
  const [billSales, setBillSales] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [sumAmount, setSumAmount] = useState(0);

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
      setBillSales(res.data.results);

      const sum = handleSumAmount(res.data.results);
      setSumAmount(sum)
    } catch (error: any) {
      Swal.fire({
        title: "Error Fetching Bill Sale list",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSumAmount = (rows : any) =>{
    let sum =0 
    rows.forEach((row:any) => {
        sum += row.amount;
    });
    return sum
  }

  const handleCancelBill = async (id : number) => {
    try {
        const button = await Swal.fire({
            icon : 'warning',
            title : 'Are you sure?',
            text : 'Do you want to cancel this bill?',
            showCancelButton : true,
            showConfirmButton : true,
        })

        if (button.isConfirmed){
            await axios.delete(`${config.apiServer}/api/billSale/remove/${id}`);
            fetchData();
        }
    } catch (error : any) {
        Swal.fire({
            title: "Error Cancelling Bill",
            text: error.message,
            icon: "error",
        })
    }
  }
  return <div>SaleReport</div>;
}
