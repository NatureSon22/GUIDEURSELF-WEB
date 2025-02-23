import { getGeneralData } from "@/api/component-info";
import { useQuery } from "@tanstack/react-query";

const Policy = () => {
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

        <div className="ql-editor list-disc list-outside p-4">
        <p
          dangerouslySetInnerHTML={{ __html: data?.privacy_policies }}
          className="p-4 h-full w-full text-gray-700 text-justify whitespace-[20px] leading-relaxed"
        ></p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
