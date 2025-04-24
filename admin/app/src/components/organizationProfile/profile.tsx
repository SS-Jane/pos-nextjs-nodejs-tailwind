"use client";
import React, { useEffect, useState } from "react";
import UserInfoCard from "@/components/organizationProfile/UserInfoCard";
import UserMetaCard from "@/components/organizationProfile/UserMetaCard";
import axios from "axios";
import config from "@/config";
import Swal from "sweetalert2";

function Profile() {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    address: "",
    subDistrict: "",
    district: "",
    province: "",
    zipCode: "",
  });
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [promptpay, setPromtpay] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [fileSelected, setFileSelected] = useState<File | null>(null);

  const fetchDataOrganization = async () => {
    try {
      const res = await axios.get(`${config.apiServer}/api/organization/info`);

      const results = res.data.results;

      if (!res.data.result) {
        setId(results.id);
        setName(results.name);
        setPhone(results.phone);
        setEmail(results.email);
        setWebsite(results.website);
        setLogo(results.logo);
        setPromtpay(results.promptpay);
        setTaxCode(results.taxCode);
        if (typeof res.data.results.address === "string") {
          setAddress(JSON.parse(res.data.results.address));
        } else {
          setAddress(res.data.results.address);
        }
      }
    } catch (error: any) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchDataOrganization();
  }, []);

  return (
    <div className="space-y-6">
      <UserMetaCard
        id={id}
        setId={setId}
        name={name}
        logo={logo}
        setLogo={setLogo}
        taxCode={taxCode}
        address={address}
        fileSelected={fileSelected} 
        setFileSelected={setFileSelected}
        fetchDataOrganization={fetchDataOrganization}
      />

      <UserInfoCard
        id={id}
        setId={setId}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        address={address}
        setAddress={setAddress}
        email={email}
        setEmail={setEmail}
        website={website}
        setWebsite={setWebsite}
        logo={logo}
        setLogo={setLogo}
        promptpay={promptpay}
        setPromtpay={setPromtpay}
        taxCode={taxCode}
        setTaxCode={setTaxCode}
        fetchDataOrganization={fetchDataOrganization}
      />
    </div>
  );
}

export default Profile;
