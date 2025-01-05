import Header from "@/components/Header";
import LogoField from "./LogoField";
import VectorField from "./VectorField";
import HistoryField from "./HistoryField";
import VisionField from "./VisionField"
import MissionField from "./MissionField"
import CoreValuesField from "./CoreValuesField"
import AdministrativeField from "./AdministrativeField";
import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";
import React, { useState, useEffect } from "react";

const UniversitySettings = () => {
  const [university, setUniversity] = useState(null);

  // Fetch university data from your API
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/university/675cdd9756f690410f1473b8",
        {
        method:"get",
        credentials:"include"
        }
        );
        const data = await response.json();
        setUniversity(data); // Assuming data contains the university info
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    fetchUniversityData();
  }, []); // Empty dependency array ensures this only runs once

  const { data, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
  });

  // Only render LogoField if university data is available
  if (!university) {
    return <div>Loading university data...</div>;
  }

  return (
    <div className="h-[2500px] pr-4 space-y-5 flex flex-col scroll">
      <Header
        title="University Management"
        subtitle="Set up university details, branding, and administrative roles."
      />
      <LogoField
        isLoading={userLoading}
        universitylogo={university.university_logo_url}
        {...data}
      />
      <VectorField
       isLoading={userLoading}
       {...data}
       universityvector={university.university_vector_url}
     />
     <HistoryField
     isLoading={userLoading}
     universityhistory={university.university_history}
     onHistoryUpdate={(newHistory) =>
      setUniversity((prev) => ({
        ...prev,
        university_history: newHistory,
      }))
    }
     {...data}
     />
     <VisionField
     isLoading={userLoading}
     universityvision={university.university_vision}
     onVisionUpdate={(newVision) =>
      setUniversity((prev) => ({
        ...prev,
        university_vision: newVision,
      }))
    }
     {...data}
     />
     <MissionField
     isLoading={userLoading}
     universitymission={university.university_mission}
     onMissionUpdate={(newMission) =>
      setUniversity((prev) => ({
        ...prev,
        university_mission: newMission,
      }))
    }
     {...data}
     />
     <CoreValuesField
     isLoading={userLoading}
     universityCoreValues={university.university_core_values}
     {...data}
     />
     <AdministrativeField
     isLoading={userLoading}
     />
       
    </div>
  );
};

export default UniversitySettings;
