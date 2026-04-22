import React, { useState } from "react";
import Tabs from "./components/tab-section/Tabs";
import DashboardTab from "./components/tab-section/DashboardTab";
import OffersTab from "./components/tab-section/OffersTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Business Overview" },
    { id: "offers", label: "Offers" },
  ];

  return (
    <div className="space-y-2">
      {/* Tab Bar */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div>
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "offers" && <OffersTab />}
      </div>
    </div>
  );
}
