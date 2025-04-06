import Header from "@/components/Header";
import SystemLogoField from "./SystemLogoField";
import AboutField from "./AboutField";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { getGeneralData } from "@/api/component-info";

const GeneralSettings = () => {
  const {data:general, isLoading, isError} = useQuery ({
    queryKey: ["generalsettings"],
    queryFn: getGeneralData,
  });

  return (
    <div className="h-[1000px] pr-4 space-y-5 flex flex-col scroll">
      <Header
        title="General Settings"
        subtitle="Set up general settings, branding, and application about."
      />
      <SystemLogoField
        isLoading={isLoading}
        generallogo={general?.general_logo_url}
      />
      <AboutField
        isLoading={isLoading}
        systemabout={general?.general_about}
      />
    </div>
  );
};

export default GeneralSettings;