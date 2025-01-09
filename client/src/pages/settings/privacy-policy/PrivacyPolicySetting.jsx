import Header from "@/components/Header";
import PoliciesField from "./PoliciesField";
import { useQuery } from "@tanstack/react-query";
import TermsConditionsField from "./TermsConditionField";
import { getGeneralData } from "@/api/component-info";

const PrivacyPolicySetting = () => {
  const {data:general, isLoading, isError} = useQuery ({
    queryKey: ["generalsettings"],
    queryFn: getGeneralData,
  });

  return (
    <div className="h-[2500px] pr-4 space-y-5 flex flex-col scroll">
      <Header
        title="Privacy and Legal"
        subtitle="Update legal policies to ensure compliance and manage data policies"
      />
      <TermsConditionsField
        isLoading={isLoading}
        systemconditions={general?.terms_conditions}
      />
      <PoliciesField
        isLoading={isLoading}
        systempolicy={general?.privacy_policies}
      />
    </div>
  );
};

export default PrivacyPolicySetting;
