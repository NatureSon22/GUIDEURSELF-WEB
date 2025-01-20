import { useState } from "react";
import { GoDotFill } from "react-icons/go";

const filters = ["All", "Student", "Faculty", "Staff", "Other"];

const FeedbackSummary = () => {
  const [filterState, setFilterState] = useState("All");

  const handleFilter = (filter) => {
    setFilterState(filter);
  };

  return (
    <div className="space-y-5 rounded-xl border border-secondary-200/50 bg-white px-7 py-7">
      <p className="font-medium">Feedback Summary</p>

      <div className="px-5">
        <div className="flex items-center justify-between">
          {filters.map((filter) => {
            return (
              <div
                key={filter}
                className={`cursor-pointer rounded-full px-[1.2rem] py-[0.5rem] text-[0.9rem] ${filter === filterState ? "border-2 border-base-300" : ""}`}
                onClick={() => handleFilter(filter)}
              >
                <GoDotFill />

                {filter}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
