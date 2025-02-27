import AddList from "@/components/food-categories/AddList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import CategoriesTableList from "@/components/food-categories/CategoriesTableList";


export const metadata: Metadata = {
  title: "Categories of food | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Categories of food page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function page() {
 

  return (
    <div>
      <PageBreadcrumb pageTitle="Categories of food" />

      
      <div>
        <CategoriesTableList />
      </div>
    </div>
  );
}
