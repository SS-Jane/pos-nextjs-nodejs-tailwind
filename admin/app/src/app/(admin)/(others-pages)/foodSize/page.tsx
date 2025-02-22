import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddList from "@/components/foodSize/AddList";

export const metadata: Metadata = {
  title: "Size of food | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Categories of food page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function page() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Size of food" />
      <div className="p-2 rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <AddList />
      </div>
    </div>
  );
}
