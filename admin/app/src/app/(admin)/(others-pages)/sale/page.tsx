import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableDinner from "@/components/sale/tableDinner";

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Sale" />

      <div className="mt-5 p-2 rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <TableDinner />
      </div>
    </div>
  );
}
