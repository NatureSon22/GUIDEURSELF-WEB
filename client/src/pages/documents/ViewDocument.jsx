import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";

import { getDocument, syncDraftDocument } from "@/api/documents";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DocumentDialog from "./DocumentDialog";
import { BiSolidMessageAltError } from "react-icons/bi";

const ViewDocument = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["document", docId],
    queryFn: () => getDocument(docId),
  });
  console.log(docId);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      (data?.document_type === "uploaded-document" && !data?.document_id) ||
      !data?.content_url
    ) {
      syncDraftDocument(docId);
    }
  }, [data, docId]);

  const handleClick = () => {
    navigate(-1);
  };

  const handleViewOriginal = () => {
    if (!data) return;
    if (data.document_type === "imported-web") {
      window.open(data.document_url, "_blank");
    } else if (data.document_type === "uploaded-document") {
      setOpen(true);
    }
  };

  if (isError) {
    return (
      <div className="flex flex-1 flex-col gap-5">
        <Header
          title="View Document"
          subtitle="An error occurred while fetching the document. Please try again later."
        />

        <div className="mt-4 grid flex-1 place-items-center text-center">
          <div className="grid place-items-center gap-2">
            <BiSolidMessageAltError className="text-6xl text-secondary-100-75" />
            <p className="text-center text-[0.95rem] text-secondary-100/60">
              An error has occurred. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-hidden">
      <Header
        title="View Document"
        subtitle="In this section, you can view the parsed contents of the uploaded documents or files"
      />

      {isLoading ? (
        <div className="mt-2 flex flex-1 flex-col space-y-4 overflow-hidden">
          <Skeleton className="h-6 w-full max-w-[400px]" />
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
          <div>
            <p className="font-medium">{data?.file_name}</p>
          </div>

          <div className="w-full flex-1 overflow-auto rounded-lg border border-secondary-100/30 bg-white p-5">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  data?.content || data?.metadata?.content || "",
                ),
              }}
            ></div>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="my-3 ml-auto flex gap-3">
          <Button
            type="button"
            variant="ghost"
            className="text-base-200"
            onClick={handleClick}
            aria-label="Return to previous page"
          >
            Return
          </Button>
          {data?.document_type !== "created-document" && (
            <Button
              type="button"
              className="bg-base-200"
              onClick={handleViewOriginal}
              aria-label="View original document"
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
