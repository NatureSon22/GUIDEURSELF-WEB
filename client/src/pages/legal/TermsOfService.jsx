import { useQuery } from "@tanstack/react-query";
import {getGeneralData} from "@/api/component-info.js"

const TermsOfService = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getGeneralData,
  });

  return (
    <div className="flex h-full w-full flex-col items-center py-14">
      <div className="w-[85%] space-y-10 pb-16">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Terms of Service</h1>
          <p>Effective Date: [November 1, 2023]</p>
        </div>

        <div
          className="text-[0.95rem] ql-editor list-disc list-outside p-4"
          dangerouslySetInnerHTML={{
            __html: isLoading ? "Loading..." : data?.terms_conditions || "",
          }}
        />
      </div>
    </div>
  );
};

export default TermsOfService;
