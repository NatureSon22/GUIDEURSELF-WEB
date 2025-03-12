import { useState } from "react";
import FeedbackSummaryChart from "./FeedbackSummaryChart";
import FeedbackSummaryReviews from "./FeedbackSummaryReviews";
import { useQuery } from "@tanstack/react-query";
import { getTotalFeedback } from "@/api/feedback";
import { Skeleton } from "@/components/ui/skeleton";

const filters = ["All", "Student", "Faculty", "Staff", "Other"];

const FeedbackSummary = () => {
  const [filterState, setFilterState] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: getTotalFeedback,
  });

  const handleFilter = (filter) => {
    setFilterState(filter);
  };

  return (
    <div className="space-y-5 rounded-xl border border-secondary-200/50 bg-white px-7 py-7">
      <p className="font-medium">Feedback Summary</p>

      <div className="space-y-6 px-5">
        <div className="flex items-center justify-between">
          {filters.map((filter) => {
            return (
              <div
                key={filter}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-[1.2rem] py-[0.5rem] text-[0.9rem] ${filter === filterState ? "border-2 border-base-300" : "transition-[background] duration-150 hover:bg-secondary-200/30"}`}
                onClick={() => handleFilter(filter)}
              >
                {filter}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-8">
          {isLoading ? (
            <Skeleton className="h-[200px] flex-1"></Skeleton>
          ) : (
            <FeedbackSummaryReviews data={data} />
          )}

          {isLoading ? (
            <Skeleton className="h-[200px] flex-1"></Skeleton>
          ) : (
            <FeedbackSummaryChart data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
