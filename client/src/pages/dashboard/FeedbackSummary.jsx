import { useState } from "react";
import FeedbackSummaryChart from "./FeedbackSummaryChart";
import FeedbackSummaryReviews from "./FeedbackSummaryReviews";

const filters = ["All", "Student", "Faculty", "Staff", "Other"];

const FeedbackSummary = () => {
  const [filterState, setFilterState] = useState("All");

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
          <FeedbackSummaryReviews />
          <FeedbackSummaryChart />
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
