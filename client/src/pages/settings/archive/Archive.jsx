import { useState } from "react";
import ArchiveDocuments from "./ArchiveDocuments";
import ArchiveVirtualTour from "./ArchiveVirtualTour";
import ArchiveKeyOfficials from "./ArchiveKeyOfficials";
import ArchiveCampus from "./ArchiveCampus";
import ArchiveAccount from "./ArchiveAccount";
import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";
import useToggleTheme from "@/context/useToggleTheme";  

const Archive = () => {
  const [selectedArchive, setSelectedArchive] = useState(0);
  const { isDarkMode } = useToggleTheme((state) => state);

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

  const handleSelectedArchive = (index) => [setSelectedArchive(index)];

  const tabs = [
    "Accounts",
    "Documents",
    "Virtual Tour",
    "Key Officials",
    ...(data?.isMultiCampus ? ["Campus"] : []),
  ];

  return (
    <div className="flex h-full flex-col gap-5 pr-6">
      <div className="flex">
        {tabs.map((tab, tabIndex) => {
          return (
            <div
              key={tab}
              className={` ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer rounded-t-lg px-5 py-3 text-[0.95rem] transition-colors duration-150 ${selectedArchive === tabIndex ? "border-b-4 border-base-200 bg-base-200/10 text-base-200" : "hover:bg-secondary-200/30"}`}
              onClick={() => handleSelectedArchive(tabIndex)}
            >
              {tab}
            </div>
          );
        })}
      </div>

      {selectedArchive === 0 && <ArchiveAccount />}
      {selectedArchive === 1 && <ArchiveDocuments />}
      {selectedArchive === 2 && <ArchiveVirtualTour userData={data} />}
      {selectedArchive === 3 && <ArchiveKeyOfficials />}
      {selectedArchive === 4 && <ArchiveCampus />}
    </div>
  );
};

export default Archive;
