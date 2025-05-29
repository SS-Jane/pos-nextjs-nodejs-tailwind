import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTableList from "@/components/user/UserTableList";

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="ข้อมูลพนักงาน" />
      <div>
        <UserTableList />
      </div>
    </div>
  );
}
