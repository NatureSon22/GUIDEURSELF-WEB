import { useState } from "react";
import { Card } from "@/components/ui/card";
import UserLogs from "./UserLogs";
import RecentAccounts from "./RecentAccounts";
import { Button } from "@/components/ui/button";
import { FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RecentFeedback from "./RecentFeedback";
import RecentResponse from "./RecentResponse";
import useToggleTheme from "@/context/useToggleTheme";

const tabs = ["User Logs", "Accounts", "Feedback", "Response Review"];
const report = [
  "/reports/user-activity-log-report",
  "/reports/user-account-report",
  "/reports/feedback-report",
  "/reports/response-review-report",
];

const AccountActivityList = () => {
  const navigate = useNavigate();
  const [setSelectedReport, setSelectedReportsetSelectedReport] = useState(0);
  const handleSelectedReportsetSelectedReport = (index) => [
    setSelectedReportsetSelectedReport(index),
  ];
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex">
          {tabs.map((tab, tabIndex) => {
            return (
              <div
                key={tab}
                className={`cursor-pointer rounded-t-lg px-5 py-3 text-[0.95rem] transition-colors duration-150 ${setSelectedReport === tabIndex ? "border-b-4 border-base-200 bg-base-200/10 text-base-200" : isDarkMode ? "text-dark-text-base-300-75 hover:bg-secondary-200/30" : "hover:bg-secondary-200/30"}`}
                onClick={() => handleSelectedReportsetSelectedReport(tabIndex)}
              >
                {tab}
              </div>
            );
          })}
        </div>

        <Button
          className="bg-base-200 shadow-none"
          onClick={() => navigate(report[setSelectedReport])}
        >
          <FaFileAlt /> View Report
        </Button>
      </div>

      <Card
        className={`flex flex-col px-7 py-7 shadow-none ${isDarkMode ? "border-dark-text-base-300-75/50 bg-dark-base-bg" : ""} transition-colors duration-150`}
      >
        {setSelectedReport === 0 && <UserLogs />}
        {setSelectedReport === 1 && <RecentAccounts />}
        {setSelectedReport === 2 && <RecentFeedback />}
        {setSelectedReport === 3 && <RecentResponse />}
      </Card>
    </div>
  );
};

export default AccountActivityList;
