import { getDocument } from "@/api/documents";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Skeleton } from "@/components/ui/skeleton";

const ViewDocument = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["document"],
    queryFn: () => getDocument(docId),
  });

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-hidden">
      <Header
        title="View Document"
        subtitle="In this section, you can view the contents of the uploaded documents or files"
      />

      {isLoading ? (
        <div className="mt-2 flex flex-1 flex-col space-y-4 overflow-hidden">
          <div className="space-y-3">
            <Skeleton className="w-full max-w-[400px] py-4"></Skeleton>
            <Skeleton className="w-full max-w-[300px] py-3"></Skeleton>
          </div>

          <Skeleton className="h-full w-full"></Skeleton>
        </div>
      ) : (
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
          <div>
            <p className="font-medium">{data.file_name}</p>
            <p className="text-[0.93rem]">
              Document has been synced successfully
            </p>
          </div>

          <div className="w-full flex-1 overflow-auto rounded-lg border border-secondary-100/30 bg-white p-5">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data.content),
              }}
            ></div>
          </div>
        </div>
      )}

      <div className="my-3 ml-auto flex gap-3">
        <Button
          type="submit"
          variant="ghost"
          className="text-base-200"
          onClick={handleClick}
        >
          Return
        </Button>
        <Button type="submit" className="bg-base-200">
          View Original
        </Button>
      </div>
    </div>
  );
};

export default ViewDocument;
