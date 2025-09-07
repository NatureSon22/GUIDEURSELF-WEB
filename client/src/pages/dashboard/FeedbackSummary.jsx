import { useState } from "react";
import FeedbackSummaryChart from "./FeedbackSummaryChart";
import FeedbackSummaryReviews from "./FeedbackSummaryReviews";
import { useQuery } from "@tanstack/react-query";
import { getTotalFeedback } from "@/api/feedback";
import { Skeleton } from "@/components/ui/skeleton";
import useToggleTheme from "@/context/useToggleTheme";

//   type: "mobile-app" | "chatbot" | "virtual-tour";
const types = [
  {
    label: "Mobile App",
    type: "mobile-app",
  },
  {
    label: "Chatbot",
    type: "chatbot",
  },
  {
    label: "Virtual Tour",
    type: "virtual-tour",
  },
];

const FeedbackSummary = () => {
  const [filterState, setFilterState] = useState("All");
  const [typeState, setTypeState] = useState("mobile-app");
  const { isDarkMode } = useToggleTheme((state) => state);

  const { data, isLoading } = useQuery({
    queryKey: ["feedbacks", filterState, typeState],
    queryFn: () => getTotalFeedback(filterState, typeState),
  });

  const handleFilter = (filter) => {
    setFilterState(filter);
  };

  return (
    <div
      className={`flex-1 space-y-5 rounded-xl border border-secondary-200/50 px-7 py-7`}
    >
      <p
        className={`font-medium ${isDarkMode ? "text-dark-text-base-300" : ""}`}
      >
        Feedback Summary
      </p>

      <div className="grid space-y-7 px-5">
        <div className="mx-11 mb-2 flex items-center justify-between">
          {types.map((type) => {
            return (
              <div
                key={type.label}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-[1.2rem] py-[0.5rem] text-[0.9rem] ${type.type === typeState ? (isDarkMode ? "border-2 border-base-450" : "border-2 border-base-300") : "border-2 border-transparent transition-[background] duration-150 hover:bg-secondary-200/30"} ${isDarkMode ? "text-dark-text-base-300-75" : ""} `}
                onClick={() => setTypeState(type.type)}
              >
                {type.label}
              </div>
            );
          })}
        </div>

        {/* <div className="flex items-center justify-between">
          {filters.map((filter) => {
            return (
              <div
                key={filter}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-[1.2rem] py-[0.5rem] text-[0.9rem] ${filter === filterState ? (isDarkMode ? "border-2 border-base-450" : "border-2 border-base-300") : "border-2 border-transparent transition-[background] duration-150 hover:bg-secondary-200/30"} ${isDarkMode ? "text-dark-text-base-300-75" : ""} `}
                onClick={() => handleFilter(filter)}
              >
                {filter}
              </div>
            );
          })}
        </div> */}

        <div className="flex items-center gap-8">
          {isLoading ? (
            <Skeleton className="mt-5 h-[220px] max-w-[200px] flex-1"></Skeleton>
          ) : (
            <FeedbackSummaryReviews data={data} />
          )}

          {isLoading ? (
            <Skeleton className="mt-5 h-[220px] flex-1"></Skeleton>
          ) : (
            <FeedbackSummaryChart data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
