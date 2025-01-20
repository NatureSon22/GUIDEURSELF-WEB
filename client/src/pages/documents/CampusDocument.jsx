import Header from "@/components/Header";
import DocumentCreateFieldInfo from "./DocumentCreateFieldInfo";
import { useNavigate } from "react-router-dom";
import RecentDocumentsTable from "./RecentDocumentsTable";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const CampusDocument = () => {
  const { state } = useLocation();
  const folder_id = state?.folder_id;
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(`/documents${path}`, { state: { folder_id } });
  };

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-center justify-between">
        <Header
          title="Create Documents"
          subtitle="Create a new document by writing, uploading an existing document, or importing a webpage."
        />

        <Button onClick={() => handleClick("/test-chat")}>Test Chat Now</Button>
      </div>

      <div className="mt-3 flex gap-8">
        {DocumentCreateFieldInfo.map((info) => {
          return (
            <div
              key={info.path}
              className="group max-w-[350px] flex-1 cursor-pointer space-y-4 rounded-lg border border-x-secondary-200/90 bg-white px-7 pb-7 pt-10"
              onClick={() => handleClick(info.path)}
            >
              {info.icon}
              <div>
                <p className="text-[1.1rem] font-semibold transition-all duration-200 group-hover:text-base-200">
                  {info.title}
                </p>
                <p className="text-[0.9rem] text-secondary-100-75 transition-all duration-200 group-hover:text-base-200">
                  {info.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <RecentDocumentsTable />
    </div>
  );
};

export default CampusDocument;
