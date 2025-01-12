import Header from "@/components/Header";
import LogoField from "./LogoField";
import VectorField from "./VectorField";
import HistoryField from "./HistoryField";
import VisionField from "./VisionField"
import MissionField from "./MissionField"
import CoreValuesField from "./CoreValuesField"
import AdministrativeField from "./AdministrativeField";
import ProgramTypeField from "./ProgramTypeField";
import ProgramNameField from "./ProgramNameField";
import MajorField from "./MajorField";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { getUniversityData } from "@/api/component-info";

const UniversitySettings = () => {
  const {data:university, isLoading, isError} = useQuery ({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  return (
    <div className="h-[2500px] pr-4 space-y-5 flex flex-col scroll">
      <Header
        title="University Management"
        subtitle="Set up university details, branding, and administrative roles."
      />
      <LogoField
        isLoading={isLoading}
        universitylogo={university?.university_logo_url}
      />
      <VectorField
       isLoading={isLoading}
       universityvector={university?.university_vector_url}
      />
      <HistoryField
      isLoading={isLoading}
      universityhistory={university?.university_history}
      />
      <VisionField
      isLoading={isLoading}
      universityvision={university?.university_vision}
      />
      <MissionField
      isLoading={isLoading}
      />
      <CoreValuesField
      isLoading={isLoading}
      universityCoreValues={university?.university_core_values}
      />
      <AdministrativeField
      isLoading={isLoading}
      />     
      <ProgramTypeField
      isLoading={isLoading}
      />
      <ProgramNameField
      isLoading={isLoading}
      />
      <MajorField
      isLoading={isLoading}
      />
    </div>
  );
};

export default UniversitySettings;
