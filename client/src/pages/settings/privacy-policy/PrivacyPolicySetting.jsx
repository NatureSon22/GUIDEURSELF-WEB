import Header from "@/components/Header";
import PoliciesField from "./PoliciesField";
import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";
import React, { useState, useEffect } from "react";
import TermsConditionsField from "./TermsConditionField";

const PrivacyPolicySetting = () => {
  const [general, setGeneral] = useState(null);


  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/general/675cdd2056f690410f1473b7",
        {
        method:"get",
        credentials:"include"
        }
        );
        const data = await response.json();
        setGeneral(data); 
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    fetchGeneralData();
  }, []); 

  const { data, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
  });

  if (!general) {
    return <div>Loading university data...</div>;
  }

  return (
    <div className="h-[2500px] pr-4 space-y-5 flex flex-col scroll">
      <Header
        title="Privacy and Legal"
        subtitle="Update legal policies to ensure compliance and manage data policies"
      />
      <TermsConditionsField
        isLoading={userLoading}
        systemconditions={general.terms_conditions}
        {...data}
          onConditionsUpdate={(newConditions) =>
          setGeneral((prev) => ({
            ...prev,
            terms_conditions: newConditions,
          }))
        }
      />
      <PoliciesField
        isLoading={userLoading}
        systempolicies={general.privacy_policies}
        {...data}
          onPoliciesUpdate={(newPolicies) =>
          setGeneral((prev) => ({
            ...prev,
            privacy_policies: newPolicies,
          }))
        }
      />
    </div>
  );
};

export default PrivacyPolicySetting;
