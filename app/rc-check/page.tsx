'use client';

import { useState } from "react";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { useToast } from "@hooks/use-toast";
import { RcSearchForm } from "@components/rc-check/rc-search-form";
import { RcDetailView } from "@components/rc-check/rc-detail-view";
import { RcInfoSections } from "@components/rc-check/rc-info-sections";

export default function RCCheck() {
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      toast({ title: "Please enter your vehicle number", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/vehicle-lookup/${encodeURIComponent(vehicleNumber.replace(/\s/g, "").trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch vehicle details");
      }
      setVehicleData(data);
      setSearched(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to fetch vehicle details", variant: "destructive" });
      setVehicleData(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <RcSearchForm
          vehicleNumber={vehicleNumber}
          setVehicleNumber={setVehicleNumber}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          loading={loading}
          onSubmit={handleSubmit}
        />
        {searched && <RcDetailView vehicleData={vehicleData} />}
        <RcInfoSections />
      </main>
      <Footer />
    </div>
  );
}
