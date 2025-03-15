import { useState } from "react";
import { Card } from "@/components/ui/card";
import UserLogs from "./UserLogs";
import RecentAccounts from "./RecentAccounts";

const tabs = ["User Logs", "Accounts"];

const AccountActivityList = () => {
  const [selectedArchive, setSelectedArchive] = useState(0);

  const handleSelectedArchive = (index) => [setSelectedArchive(index)];

  return (
    <div className="space-y-4">
      <div className="flex">
        {tabs.map((tab, tabIndex) => {
          return (
            <div
              key={tab}
              className={`cursor-pointer rounded-t-lg px-5 py-3 text-[0.95rem] transition-colors duration-150 ${selectedArchive === tabIndex ? "border-b-4 border-base-200 bg-base-200/10 text-base-200" : "hover:bg-secondary-200/30"}`}
              onClick={() => handleSelectedArchive(tabIndex)}
            >
              {tab}
            </div>
          );
        })}
      </div>

      <Card className="flex flex-col px-7 py-7 shadow-none">
        {selectedArchive === 0 && <UserLogs />}
        {selectedArchive === 1 && <RecentAccounts />}
      </Card>
    </div>
  );
};

export default AccountActivityList;
