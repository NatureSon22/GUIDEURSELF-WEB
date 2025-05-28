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
import useToggleTheme from "@/context/useToggleTheme";

const TallyReportSummary = () => {
  // Declare state hooks FIRST
  const [filter, setFilter] = useState([]);
  const [reset, setReset] = useState(false);
  const { isDarkMode } = useToggleTheme((state) => state);

  // NOW useQuery can safely access 'filter'
  const { data, isLoading, isError, error } = useQuery({
    // Also consider adding error handling
    queryKey: ["tally_summary", filter],
    queryFn: () => getResponseReview(filter),
  });

  // Optional: Add basic error handling display
  if (isError) {
    return <div>Error fetching summary: {error.message}</div>;
  }

  return (
    <div
      className={`flex-1 space-y-8 rounded-xl border border-secondary-200/50 px-7 py-5 ${isDarkMode ? "bg-dark-base-bg" : "bg-white"} transition-colors duration-150`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`font-medium ${isDarkMode ? "text-dark-text-base-300" : ""} `}
        >
          Review Summary
        </p>
        <div className="flex items-center gap-3">
          <ComboBox
            options={tally_summary}
            placeholder="Select date filter"
            filter="date" // This prop name is okay, but slightly confusing given the state name
            setFilters={setFilter}
            reset={reset}
          />
          <Button
            className={`ml-auto text-secondary-100-75 ${isDarkMode ? "border-dark-text-base-300-75/60 bg-dark-base-bg text-dark-text-base-300-75 hover:bg-dark-base-bg hover:text-dark-text-base-300-75" : ""}`}
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
              <p
                className={`text-[2.5rem] font-semibold ${isDarkMode ? "text-dark-text-base-300" : ""} `}
              >
                {data?.helpfulMessages || 0}
              </p>
            )}
          </div>
          <p
            className={`text-[0.95rem] font-semibold tracking-wider ${isDarkMode ? "text-dark-secondary-100-75" : "text-secondary-100-75/50"} `}
          >
            HELPFUL
          </p>
        </div>

        <div className="space-y-2 text-center">
          <div className="flex items-center space-x-5">
            <BiSolidDislike className="text-[4.5rem] text-base-200" />
            {isLoading ? (
              <Skeleton className="h-[60px] w-20" />
            ) : (
              <p
                className={`text-[2.5rem] font-semibold ${isDarkMode ? "text-dark-text-base-300" : ""} `}
              >
                {data?.unhelpfulMessages || 0}
              </p>
            )}
          </div>
          <p
            className={`text-[0.95rem] font-semibold tracking-wider ${isDarkMode ? "text-dark-secondary-100-75" : "text-secondary-100-75/50"} `}
          >
            NOT HELPFUL
          </p>
        </div>
      </div>
    </div>
  );
};

export default TallyReportSummary;
