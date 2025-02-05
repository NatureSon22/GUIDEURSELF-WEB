import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { RiAddLargeFill } from "react-icons/ri";
import { GrPowerReset } from "react-icons/gr";

import { deleteDocument, getAllDocuments } from "@/api/documents";

import Header from "@/components/Header";
import DataTable from "@/components/DataTable";
import AllDocumentsColumns from "@/components/columns/AllDocuments";
import DraftDocumentsColumns from "@/components/columns/DraftsDocument";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import Loading from "@/components/Loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DialogContainer from "@/components/DialogContainer";
import { FaCircleExclamation } from "react-icons/fa6";
import { useToast } from "@/hooks/use-toast";
import { getAllCampuses } from "@/api/component-info";
import documentStatus from "@/data/documentStatus";

const AllDocuments = () => {
  const { toast } = useToast();
  const [type, setType] = useState("all-documents");
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [reset, setReset] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: allDocuments, isLoading: isLoadingAllDocuments } = useQuery({
    queryKey: ["all-documents"],
    queryFn: () => getAllDocuments(),
  });

  const { data: draftedDocuments, isLoading: isLoadingDraftedDocuments } =
    useQuery({
      queryKey: ["drafted-documents"],
      queryFn: () => getAllDocuments("", "", true),
    });

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  

  const [open, setOpen] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState(null);

  const {
    mutateAsync: handleDeleteDocument,
    isPending,
    isSuccess,
    reset: resetDelete,
  } = useMutation({
    mutationFn: () => deleteDocument(selectedDocument),
    onSuccess: () => {
      setTimeout(() => {
        setOpen(false);
        setSelectedDocument(null);
        queryClient.invalidateQueries(["all-documents"]);
        resetDelete();
      }, 1000);
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        variant: "destructive",
        description: "Failed to delete document. Please try again.",
      });
      setOpen(false);
      setSelectedDocument(null);
      resetDelete();
    },
  });

  const handleTypeChange = (newType) => setType(newType);

  const handleNavigate = (path) => navigate(path);

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="flex gap-8 overflow-hidden">
      <div className="flex flex-1 flex-col gap-5">
        <Header
          title="All Documents"
          subtitle="This section lists all of the documents uploaded to the system. You can review, edit, or manage these files to ensure they are properly prepared for use."
        />

        <div className="flex items-center gap-5">
          <Input
            type="text"
            placeholder="Search"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="text-secondary-100-75"
              onClick={() => handleNavigate(-1)}
            >
              <RiAddLargeFill /> Create Document
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <p>Filters:</p>
          <DateRangePicker />
          <ComboBox
            options={allCampuses || []}
            placeholder="select campus"
            filter="campus_id"
            setFilters={setFilters}
            reset={reset}
          />
          <ComboBox
            options={documentStatus || []}
            placeholder="select status"
            filter="status"
            setFilters={setFilters}
            reset={reset}
          />

          <Button
            className="ml-auto text-secondary-100-75"
            variant="outline"
            onClick={handleReset}
          >
            <GrPowerReset /> Reset Filters
          </Button>
        </div>

        {isLoadingAllDocuments || isLoadingDraftedDocuments ? (
          <Loading />
        ) : (
          <DataTable
            data={type === "drafts" ? draftedDocuments : allDocuments}
            columns={
              type === "all-documents"
                ? AllDocumentsColumns
                : DraftDocumentsColumns
            }
            globalFilter={globalFilter}
            filters={filters}
            pageSize={8}
            columnActions={{ navigate, setOpen, setSelectedDocument }}
          />
        )}
      </div>

      <div className="max-w-[300px] flex-1 space-y-4 border-l border-secondary-200-60 bg-white px-7 py-6">
        <div
          className={`cursor-pointer border-l-4 pl-4 text-[0.9rem] ${type === "all-documents" && "border-base-200"}`}
          onClick={() => handleTypeChange("all-documents")}
        >
          <p
            className={
              type === "all-documents"
                ? "font-semibold text-base-200"
                : "text-secondary-100-75"
            }
          >
            All Documents
          </p>
        </div>

        <div
          className={`cursor-pointer border-l-4 pl-4 text-[0.9rem] ${type === "drafts" && "border-base-200"}`}
          onClick={() => handleTypeChange("drafts")}
        >
          <p
            className={
              type === "drafts"
                ? "font-semibold text-base-200"
                : "text-secondary-100-75"
            }
          >
            Drafts
          </p>
        </div>
      </div>

      <DialogContainer
        openDialog={open}
        style={{ width: isSuccess ? "sm:max-w-[350px]" : "sm:max-w-[400px]" }}
      >
        {isSuccess ? ( // how t reset isSuccess
          <p className="text-[0.95rem] font-semibold">
            Document successfully removed!
          </p>
        ) : isPending ? (
          <div className="flex flex-col items-center gap-5">
            <Loading />
            <p className="text-[0.9rem] font-semibold">Removing document...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <FaCircleExclamation className="text-[2.5rem] text-base-200" />
            <p className="text-[0.95rem] font-semibold">
              Do you want to remove this document?
            </p>
            <div className="flex w-full gap-4">
              <Button
                variant="outline"
                className="flex-1 border-secondary-200 py-1 text-secondary-100-75"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                className="hover:bg flex-1 border border-base-200 bg-base-200/10 py-1 text-base-200 shadow-none hover:bg-base-200/10"
                onClick={handleDeleteDocument}
                disabled={isPending}
              >
                {isPending ? "Proceeding..." : "Proceed"}
              </Button>
            </div>
          </div>
        )}
      </DialogContainer>
    </div>
  );
};

export default AllDocuments;
