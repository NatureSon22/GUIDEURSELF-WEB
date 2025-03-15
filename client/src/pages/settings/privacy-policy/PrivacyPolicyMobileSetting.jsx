import Header from "@/components/Header";
import PoliciesFieldMobile from "./PoliciesMobile";
import { useQuery } from "@tanstack/react-query";
import TermsConditionsMobile from "./TermsConditionMobile";
import { getGeneralData } from "@/api/component-info";

const PrivacyPolicyMobileSetting = () => {
  const {data:general, isLoading, isError} = useQuery ({
    queryKey: ["generalsettings"],
    queryFn: getGeneralData,
  });

  return (
    <div className="h-[2500px] pr-4 space-y-5 flex flex-col scroll">
      <Header
        title="Privacy and Legal - Mobile Application"
        subtitle="Update legal policies of mobile application to ensure compliance and manage data policies"
      />
      <TermsConditionsMobile
        isLoading={isLoading}
        systemconditions={general?.terms_conditions_mobile}
      />
      <PoliciesFieldMobile
        isLoading={isLoading}
        systempolicy={general?.privacy_policies_mobile}
      />
    </div>
  );
};

export default PrivacyPolicyMobileSetting;
