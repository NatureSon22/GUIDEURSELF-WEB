import { getGeneralData } from "@/api/component-info";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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

        {isLoading ? (
          <div className="space-y-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="ql-editor list-outside list-disc p-4">
            <p
              dangerouslySetInnerHTML={{ __html: data?.privacy_policies }}
              className="whitespace-[20px] h-full w-full p-4 text-justify leading-relaxed text-gray-700"
            ></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Policy;
