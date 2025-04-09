"use client";
import React, { useState } from "react";
import UserAddressCard from "@/components/organizationProfile/UserAddressCard";
import UserInfoCard from "@/components/organizationProfile/UserInfoCard";
import UserMetaCard from "@/components/organizationProfile/UserMetaCard";

function Profile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [promtpay, setPromtpay] = useState("");
  const [taxCode, setTaxCode] = useState("");

  console.log("address", address);

  return (
    <div className="space-y-6">
      <UserMetaCard
        name={name}
        logo={logo}
        setLogo={setLogo}
        taxCode={taxCode}
        address={address}
      />
      <UserInfoCard
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
        promtpay={promtpay}
        setPromtpay={setPromtpay}
        taxCode={taxCode}
        setTaxCode={setTaxCode}
      />
    </div>
  );
}

export default Profile;
