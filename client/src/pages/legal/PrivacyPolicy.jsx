import { getGeneralData } from "@/api/general-settings";
import { useQuery } from "@tanstack/react-query";

const PrivacyPolicy = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getGeneralData,
  });

  return (
    <div className="flex h-full w-full flex-col items-center py-14">
      <div className="w-[85%] space-y-10 pb-16">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Privacy and Policy</h1>
          <p>Effective Date: [November 1, 2023]</p>
        </div>

        <div
          className="text-[0.95rem]"
          dangerouslySetInnerHTML={{
            __html: isLoading ? "Loading..." : data?.privacy_policies || "",
          }}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
