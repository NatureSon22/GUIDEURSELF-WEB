import { useQuery } from "@tanstack/react-query";
import { getGeneralData } from "@/api/component-info.js";
import { Skeleton } from "@/components/ui/skeleton";

const TermsOfService = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["termsOfService"],
    queryFn: getGeneralData,
  });

  return (
    <div className="flex h-full w-full flex-col items-center py-14">
      <div className="w-[85%] space-y-10 pb-16">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Terms of Service</h1>
          <p>Effective Date: November 1, 2023</p>
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
          <div
            className="ql-editor list-outside list-disc p-4 text-[0.95rem]"
            dangerouslySetInnerHTML={{
              __html: data?.terms_conditions || "",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TermsOfService;
