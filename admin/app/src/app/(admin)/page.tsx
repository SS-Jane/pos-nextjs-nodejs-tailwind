import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import SaleReportTable from "@/components/ecommerce/SaleReportTable";
import DailySalesChart from "@/components/ecommerce/DailySalesChart";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5 xl:block hidden">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <DailySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5 block xl:hidden">
          <MonthlyTarget />
        </div>


      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 ">
        <SaleReportTable />
      </div>
    </div>
  );
}
