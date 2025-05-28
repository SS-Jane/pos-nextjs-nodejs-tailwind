"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Select from "../form/Select";
import { it } from "node:test";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const [data, setData] = useState([]);
  const [totalAmount , setTotalAmount] = useState(0);
  const [arrYear, setArrYear] = useState<number[]>([]);
  const [selectYear, setSelectYear] = useState(dayjs().year());

  useEffect(()=>{
    setArrYear(Array.from({ length : 10}, (_, i) => dayjs().year() - i));
    fetchDataSumPerMonthInYear();
  },[])

  const fetchDataSumPerMonthInYear = async () => {
    try {
      const payload = {
        year : selectYear
      }

      const res = await axios.post(`${config.apiServer}/api/report/sumPerMonthInYear`, payload);
      console.log("SumMonthInYear",res.data.results);
      setData(res.data.results);
      setTotalAmount(sumTotalAmount(res.data.results));

    } catch (error : any) {
      Swal.fire({
        title : 'Error',
        text : `ไม่สามารถดึงข้องมูล SumPerMonthInYear : ${error.message}`,
        icon : 'error'
      })
    }
  }

  const sumTotalAmount = (data : any[]) => {
    let sum = 0;

    data.forEach((item : any)=>{
      sum += item.amount;
    })

    return sum;
  }

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const series = [
    {
      name: "Sales",
      data: data.map((item : any)=> item.amount.toFixed(2).toLocaleString('th-TH')),
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="flex flex-row items-center space-x-2 my-2">
        <div>
          <p className="my-2 text-gray-500 text-theme-sm dark:text-gray-400">
            ปี
          </p>
          <Select
            defaultValue={selectYear.toString()}
            options={arrYear.map((year : number)=>{
              return {
                label : year.toString(),
                value : year.toString()
              }
            })}
            placeholder="Select Option"
            onChange={(value) => setSelectYear(parseInt(value))}
            className="dark:bg-dark-900"

          />
        </div>
        <div>
          <p className="my-2 text-gray-500 text-theme-sm dark:text-gray-400">
            &nbsp;
          </p>
          <button
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-3 py-2.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            onClick={fetchDataSumPerMonthInYear}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} /> แสดงรายการ
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
