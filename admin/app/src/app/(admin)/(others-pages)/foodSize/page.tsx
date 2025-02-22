import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FoodSizeTableList from "@/components/foodSize/FoodSizeTableList";

export const metadata: Metadata = {
  title: "Size of food | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Categories of food page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Categories of food" />

      
      <div>
        <FoodSizeTableList />
      </div>
    </div>
  );
}
