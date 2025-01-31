import { useState } from "react";
import ArchiveDocuments from "./ArchiveDocuments";
import ArchiveVirtualTour from "./ArchiveVirtualTour";
import ArchiveKeyOfficials from "./ArchiveKeyOfficials";
import ArchiveCampus from "./ArchiveCampus";

const tabs = ["Documents", "Virtual Tour", "Key Officials", "Campus"];

const Archive = () => {
  const [selectedArchive, setSelectedArchive] = useState(0);

  const handleSelectedArchive = (index) => [setSelectedArchive(index)];

  return (
    <div className="flex h-full flex-col gap-5">
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

      {selectedArchive === 0 && <ArchiveDocuments />}
      {selectedArchive === 1 && <ArchiveVirtualTour />}
      {selectedArchive === 2 && <ArchiveKeyOfficials />}
      {selectedArchive === 3 && <ArchiveCampus />}
    </div>
  );
};

export default Archive;
