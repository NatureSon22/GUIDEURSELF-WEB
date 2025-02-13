import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import { FaCircleExclamation } from "react-icons/fa6";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import DataTable from "@/components/DataTable";
import DialogContainer from "@/components/DialogContainer";
import Loading from "@/components/Loading";
import documentColumns from "@/components/columns/ArchiveDocuments";
import documentStatus from "@/data/documentStatus";
import { getAllCampuses } from "@/api/component-info";
import {
  createDocument,
  getAllDocuments,
  uploadDraftDocument,
  uploadFromWeb,
} from "@/api/documents";
import { useToast } from "@/hooks/use-toast";

const ArchiveDocuments = () => {
  const { toast } = useToast();
  const [searchState, setSearchState] = useState({
    globalFilter: "",
    filters: [],
    reset: false,
  });
  const [dialogState, setDialogState] = useState({
    open: false,
    selectedDocument: null,
  });
  const client = useQueryClient();

  // Queries
  const { data: allDocuments } = useQuery({
    queryKey: ["allDocuments"],
    queryFn: () => getAllDocuments("", "", false, false, true, true),
  });

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  const {
    mutateAsync: unarchiveUploadedDocument,
    isPending: isUnarchivingUploadedDocument,
    isSuccess: isSuccessUploadedDocument,
  } = useMutation({
    mutationFn: uploadDraftDocument,
    onSuccess: () => {
      handleMutationResponse(true, "Document unarchived successfully");
      client.invalidateQueries(["allDocuments"]);
    },
    onError: () =>
      handleMutationResponse(false, "Failed to unarchive document"),
  });

  const {
    mutateAsync: unarchiveImportedWebDocument,
    isPending: isUnarchivingImportedWebDocument,
    isSuccess: isSuccessImportedWebDocument,
  } = useMutation({
    mutationFn: uploadFromWeb,
    onSuccess: () => {
      handleMutationResponse(true, "Document unarchived successfully");
      client.invalidateQueries(["allDocuments"]);
    },
    onError: () =>
      handleMutationResponse(false, "Failed to unarchive document"),
  });

  const {
    mutateAsync: unarchiveCreatedDocument,
    isPending: isUnarchivingCreatedDocument,
    isSuccess: isSuccessCreatedDocument,
  } = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      handleMutationResponse(true, "Document unarchived successfully");
      client.invalidateQueries(["allDocuments"]);
    },
    onError: () =>
      handleMutationResponse(false, "Failed to unarchive document"),
  });

  // Handlers
  const handleMutationResponse = (success, message) => {
    setDialogState((prev) => ({ ...prev, open: false }));
    setSearchState((prev) => ({ ...prev, reset: !prev.reset }));
    toast({
      variant: success ? "default" : "destructive",
      title: success ? "Success" : "Error",
      description: message,
    });
  };

  const handleReset = () => {
    setSearchState({
      globalFilter: "",
      filters: [],
      reset: !searchState.reset,
    });
  };

  const downloadFile = async (file_name, document_url) => {
    try {
      const response = await fetch(document_url);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const file = new File([blob], file_name, {
        type: blob.type || "application/octet-stream",
      });

      return file;
    } catch (e) {
      console.error("Download Error:", e);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to download the document",
      // });
    }
  };

  const handleUnarchiveDocument = async () => {
    const {
      _id,
      document_type,
      visibility,
      document_url,
      type,
      title,
      metadata,
      file_name,
    } = dialogState.selectedDocument;
    const formData = new FormData();

    formData.append("documentId", _id);
    formData.append("visibility", visibility);

    if (document_type === "uploaded-document" && type === "published") {
      formData.append("document_url", document_url);
      const file = await downloadFile(file_name, document_url);

      if (!file) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File download failed. Please try again.",
        });
        return;
      }

      formData.append("document", file);
      await unarchiveUploadedDocument(formData);
    } else if (document_type === "uploaded-document" && type === "draft") {
      formData.append("isdraft", true);
      //formData.append("")
      await unarchiveUploadedDocument(formData);
    } else if (document_type === "imported-web" && type === "published") {
      formData.append("url", document_url);
      formData.append("title", title);
      unarchiveImportedWebDocument(formData);
    } else if (document_type === "imported-web" && type === "draft") {
      formData.append("url", document_url);
      formData.append("title", title);
      formData.append("isdraft", true);
      unarchiveImportedWebDocument(formData);
    } else if (document_type === "created-document" && type === "draft") {
      formData.append("isdraft", true);
      unarchiveCreatedDocument(formData);
    } else if (document_type === "created-document" && type === "published") {
      formData.append("name", file_name);
      formData.append("content", metadata.content);
      unarchiveCreatedDocument(formData);
    }
  };

  // Dialog Content Components
  const DialogContent = () => {
    if (
      isSuccessUploadedDocument ||
      isSuccessImportedWebDocument ||
      isSuccessCreatedDocument
    ) {
      return (
        <p className="text-[0.95rem] font-semibold">
          Document successfully unarchived!
        </p>
      );
    }

    if (isUnarchivingUploadedDocument || isUnarchivingImportedWebDocument) {
      return (
        <div className="flex flex-col items-center gap-5">
          <Loading />
          <p className="text-[0.9rem] font-semibold">Unarchiving...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-5">
        <FaCircleExclamation className="text-[2.5rem] text-base-200" />
        <p className="text-[0.95rem] font-semibold">
          Do you want to unarchive this document?
        </p>
        <div className="flex w-full gap-4">
          <Button
            variant="outline"
            className="flex-1 border-secondary-200 py-1 text-secondary-100-75"
            onClick={() => setDialogState((prev) => ({ ...prev, open: false }))}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 border border-base-200 bg-base-200/10 py-1 text-base-200 shadow-none hover:bg-base-200/10"
            onClick={handleUnarchiveDocument}
            disabled={
              isUnarchivingUploadedDocument ||
              isUnarchivingImportedWebDocument ||
              isUnarchivingCreatedDocument
            }
          >
            {isUnarchivingUploadedDocument ||
            isUnarchivingImportedWebDocument ||
            isUnarchivingCreatedDocument
              ? "Proceeding..."
              : "Proceed"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col space-y-5">
      <Input
        type="text"
        placeholder="Search"
        value={searchState.globalFilter}
        onChange={(e) =>
          setSearchState((prev) => ({ ...prev, globalFilter: e.target.value }))
        }
      />

      <div className="flex items-center gap-5">
        <p>Filters:</p>
        <DateRangePicker />
        <ComboBox
          options={allCampuses || []}
          placeholder="select campus"
          filter="campus_name"
          setFilters={(filters) =>
            setSearchState((prev) => ({ ...prev, filters }))
          }
          reset={searchState.reset}
        />
        <ComboBox
          options={documentStatus}
          placeholder="select status"
          filter="status"
          setFilters={(filters) =>
            setSearchState((prev) => ({ ...prev, filters }))
          }
          reset={searchState.reset}
        />
        <Button
          className="ml-auto text-secondary-100-75"
          variant="outline"
          onClick={handleReset}
        >
          <GrPowerReset /> Reset Filters
        </Button>
      </div>

      <div className="flex-1">
        <DataTable
          data={allDocuments || []}
          columns={documentColumns}
          filters={searchState.filters}
          setFilters={(filters) =>
            setSearchState((prev) => ({ ...prev, filters }))
          }
          globalFilter={searchState.globalFilter}
          setGlobalFilter={(globalFilter) =>
            setSearchState((prev) => ({ ...prev, globalFilter }))
          }
          columnActions={{
            handleSetSelectedDocument: (document) =>
              setDialogState({ open: true, selectedDocument: document }),
          }}
        />
      </div>

      <DialogContainer openDialog={dialogState.open}>
        <DialogContent />
      </DialogContainer>
    </div>
  );
};

export default ArchiveDocuments;
