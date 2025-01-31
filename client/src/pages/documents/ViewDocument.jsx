import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";

import { getDocument } from "@/api/documents";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DocumentDialog from "./DocumentDialog";

const ViewDocument = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["document", docId],
    queryFn: () => getDocument(docId),
  });
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    navigate(-1);
  };

  const handleViewOriginal = () => {
    if (data?.document_type === "imported-web") {
      window.open(data?.document_url, "_blank");
    } else if (data?.document_type === "uploaded-document") {
      setOpen(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-hidden">
      <Header
        title="View Document"
        subtitle="In this section, you can view the parsed contents of the uploaded documents or files"
      />

      {isLoading ? (
        <div className="mt-2 flex flex-1 flex-col space-y-4 overflow-hidden">
          <div className="space-y-3">
            <Skeleton className="w-full max-w-[400px] py-4"></Skeleton>
          </div>

          <Skeleton className="h-full w-full"></Skeleton>
        </div>
      ) : (
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
          <div>
            <p className="font-medium">{data.file_name}</p>
            {/* <p className="text-[0.93rem]">
              Document has been synced successfully
            </p> */}
          </div>

          <div className="w-full flex-1 overflow-auto rounded-lg border border-secondary-100/30 bg-white p-5">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  data.content || data.metadata.content,
                ),
              }}
            ></div>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="my-3 ml-auto flex gap-3">
          <Button
            type="submit"
            variant="ghost"
            className="text-base-200"
            onClick={handleClick}
          >
            Return
          </Button>
          {data?.document_type !== "created-document" && (
            <Button
              type="submit"
              className="bg-base-200"
              onClick={handleViewOriginal}
            >
              View Original
            </Button>
          )}
        </div>
      )}

      <DocumentDialog
        open={open}
        setOpen={setOpen}
        document_url={data?.document_url}
      />
    </div>
  );
};

export default ViewDocument;
