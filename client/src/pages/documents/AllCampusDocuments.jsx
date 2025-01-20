import { getAllFolders } from "@/api/documents";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const AllCampusDocuments = () => {
  const navigate = useNavigate();
  const {
    data: campusDocuments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["campusDocuments"],
    queryFn: getAllFolders,
  });

  const handleClick = (campusId, folder_id) => {
    navigate(`/documents/${campusId}`, { state: { folder_id } });
  };

  return (
    <div className="flex flex-1 flex-col gap-5">
      <Header
        title="Campus Documents"
        subtitle="Access, review, and generate reports on user account records"
      />

      <div className="mt-8 grid grid-cols-5 gap-x-8 gap-y-6">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full py-10" />
          ))
        ) : isError ? (
          <div className="text-red-500">
            Error: {error?.message || "Failed to load documents"}
          </div>
        ) : campusDocuments?.length > 0 ? (
          campusDocuments.map((document) => (
            <div
              key={document._id}
              className="cursor-pointer rounded border bg-white p-4 shadow-sm hover:shadow-md"
              onClick={() => handleClick(document._id, document.folder_id)}
            >
              <p>{document.folder_name}</p>
            </div>
          ))
        ) : (
          <div className="col-span-5 text-center text-gray-500">
            No documents found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCampusDocuments;
