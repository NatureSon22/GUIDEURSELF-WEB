import Header from "@/components/Header";
import DocumentCreateFieldInfo from "./DocumentCreateFieldInfo";
import { useNavigate } from "react-router-dom";
import RecentDocumentsTable from "./RecentDocumentsTable";
import { Button } from "@/components/ui/button";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import FeaturePermission from "@/layer/FeaturePermission";

const CampusDocument = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(`/documents${path}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-5">
      <Header
        title="Create Documents"
        subtitle="Create a new document by writing, uploading an existing document, or importing a webpage."
      />

      <div className="mt-3 grid grid-cols-4 gap-8">
        {DocumentCreateFieldInfo.map((info, index) => {
          return (
            <FeaturePermission
              key={`${info.path}-${index}`}
              module="Manage Documents"
              access={info.access}
            >
              <div
                role="button"
                tabIndex={0}
                className="group flex-1 cursor-pointer space-y-4 rounded-lg border border-x-secondary-200/90 bg-white px-7 pb-7 pt-10"
                onClick={() => handleClick(info.path)}
                onKeyDown={(e) => e.key === "Enter" && handleClick(info.path)}
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
            </FeaturePermission>
          );
        })}

        <div className="flex flex-1 flex-col gap-4">
          <div
            className="grid h-full cursor-pointer place-items-center rounded-lg bg-base-200"
            onClick={() => handleClick("/test-chat")}
          >
            <div className="grid place-items-center gap-2">
              <HiChatBubbleLeftRight className="text-[40px] text-white" />
              <p className="font-medium text-white">Test Chat</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="text-secondary-100-75"
            onClick={() => navigate("/documents/all-documents")}
          >
            Show All Documents
          </Button>
        </div>
      </div>

      <RecentDocumentsTable />
    </div>
  );
};

export default CampusDocument;
