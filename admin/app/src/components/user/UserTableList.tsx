"use client";

import React, { useEffect, useState } from "react";
import BasicTable from "./BasicTable";
import ComponentCard from "../common/ComponentCard";
import AddList from "./AddList";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/config";

export interface UsersList {
  id: number;
  fname: string;
  lname: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  level: string;
}

export default function UserTableList() {
  const [usersList, setUsersList] = useState<UsersList[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  useEffect(() => {
    setCurrentUserId(parseInt(localStorage.getItem("posUserID") || "0"));
    fetchDataUsersList();
  }, []);

  const fetchDataUsersList = async () => {
    try {
      const res = await axios.get(`${config.apiServer}/api/user/list`);

      setUsersList(res.data.results);
    } catch (error: any) {
      Swal.fire({
        title: "Error message",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="p-2 rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <AddList
        fetchDataUsersList={fetchDataUsersList}
         />
      </div>
      <ComponentCard title="ตารางข้อมูลผู้ใช้" className="mt-5">
        <BasicTable
          fetchDataUsersList={fetchDataUsersList}
          usersList={usersList}
          currentUserId={currentUserId}
        />
      </ComponentCard>
    </div>
  );
}
