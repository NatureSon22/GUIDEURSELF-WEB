import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { tally_summary } from "@/data/dashboard";
import { useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { getResponseReview } from "@/api/feedback";
import { Skeleton } from "@/components/ui/skeleton";

const TallyReportSummary = () => {
  // Declare state hooks FIRST
  const [filter, setFilter] = useState([]);
  const [reset, setReset] = useState(false);

  // NOW useQuery can safely access 'filter'
  const { data, isLoading, isError, error } = useQuery({ // Also consider adding error handling
    queryKey: ["tally_summary", filter],
    queryFn: () => getResponseReview(filter),
  });

  // Optional: Add basic error handling display
  if (isError) {
     return <div>Error fetching summary: {error.message}</div>;
  }

  return (
    <div className="flex-1 space-y-8 rounded-xl border border-secondary-200/50 bg-white px-7 py-5">
      {/* ... rest of the component remains the same ... */}

      <div className="flex items-center justify-between">
        <p className="font-medium">Review Summary</p>
        <div className="flex items-center gap-3">
          <ComboBox
            options={tally_summary}
            placeholder="Select date filter"
            filter="date" // This prop name is okay, but slightly confusing given the state name
            setFilters={setFilter}
            reset={reset}
          />
          <Button
            className="ml-auto text-secondary-100-75"
            variant="outline"
            onClick={() => {
              setFilter([]);
              setReset((prev) => !prev);
            }}
          >
            <GrPowerReset />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-around">
        <div className="space-y-2 text-center">
          <div className="flex items-center space-x-5">
            <BiSolidLike className="text-[4.5rem] text-base-200" />
            {isLoading ? (
              <Skeleton className="h-[60px] w-20" />
            ) : (
              <p className="text-[2.5rem] font-semibold">
                {data?.helpfulMessages || 0}
              </p>
            )}
          </div>
          <p className="text-[0.95rem] font-semibold tracking-wider text-secondary-100-75/50">
            HELPFUL
          </p>
        </div>

        <div className="space-y-2 text-center">
          <div className="flex items-center space-x-5">
            <BiSolidDislike className="text-[4.5rem] text-base-200" />
            {isLoading ? (
              <Skeleton className="h-[60px] w-20" />
            ) : (
              <p className="text-[2.5rem] font-semibold">
                {data?.unhelpfulMessages || 0}
              </p>
            )}
          </div>
          <p className="text-[0.95rem] font-semibold tracking-wider text-secondary-100-75/50">
            NOT HELPFUL
          </p>
        </div>
      </div>
    </div>
  );
};

export default TallyReportSummary;