import { useMemo, useState } from "react";
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
import Loading from "@/components/Loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DialogContainer from "@/components/DialogContainer";
import { FaCircleExclamation } from "react-icons/fa6";
import { useToast } from "@/hooks/use-toast";
import { getAllCampuses } from "@/api/component-info";
import documentStatus from "@/data/documentStatus";
import documentTypes from "@/data/doc_types";
import useUserStore from "@/context/useUserStore";
import MultiCampus from "@/layer/MultiCampus";
import useToggleTheme from "@/context/useToggleTheme";

const AllDocuments = () => {
  const { toast } = useToast();
  const [type, setType] = useState("all-documents");
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reset, setReset] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.currentUser);
  const { isDarkMode } = useToggleTheme((state) => state);

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
        queryClient.invalidateQueries(["all-documents"]);
        setOpen(false);
        setSelectedDocument(null);
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

  const changeValue = (value) => {
    const filterVal = {
      uploaded: "uploaded-document",
      created: "created-document",
      imported: "imported-web",
    };

    return filterVal[value] || value;
  };

  const filteredDocuments = useMemo(() => {
    const documentsList = type === "drafts" ? draftedDocuments : allDocuments;
    if (!documentsList) return [];

    return documentsList.filter((doc) => {
      // Ensure all filters match
      const matchesFilters = filters.every((filter) => {
        if (!filter.value) return true;

        // Support nested keys like "campus_id.campus_name"
        const docValue = filter.id
          .split(".")
          .reduce((obj, key) => obj?.[key], doc);

        console.log(
          String(docValue)
            .toLowerCase()
            .includes(changeValue(filter.value.toLowerCase())),
        );

        return docValue
          ? String(docValue)
              .toLowerCase()
              .includes(changeValue(filter.value.toLowerCase()))
          : false;
      });

      // Parse date safely
      const accountDate = new Date(doc.date_and_time);
      if (isNaN(accountDate)) return false; // Skip invalid dates

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const matchesDateRange =
        (!from || accountDate >= from) && (!to || accountDate <= to);

      return matchesFilters && matchesDateRange;
    });
  }, [filters, fromDate, toDate, type, draftedDocuments, allDocuments]);

  const handleTypeChange = (newType) => setType(newType);

  const handleNavigate = (path) => navigate(path);

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
    setFromDate("");
    setToDate("");
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
            className={`${isDarkMode ? "border-transparent bg-dark-secondary-100-75/20 text-dark-text-base-300-75 !placeholder-dark-secondary-100-75" : ""}`}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className={` ${isDarkMode ? "border-transparent bg-base-200 text-white" : "text-secondary-100-75"} `}
              onClick={() => handleNavigate(-1)}
            >
              <RiAddLargeFill /> Create Document
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <p className={` ${isDarkMode ? "text-dark-text-base-300" : ""} `}>
            Filters:
          </p>

          <div className="flex gap-2">
            <Input
              type="date"
              className={`w-[170px] ${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300-75" : ""} `}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <Input
              type="date"
              className={`w-[170px] ${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300-75" : ""} `}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <MultiCampus>
            <ComboBox
              options={allCampuses || []}
              placeholder="select campus"
              filter="campus_id.campus_name"
              setFilters={setFilters}
              reset={reset}
            />
          </MultiCampus>

          <ComboBox
            options={documentTypes || []}
            placeholder="select type"
            filter="document_type"
            setFilters={setFilters}
            reset={reset}
          />

          {type === "all-documents" && (
            <ComboBox
              options={documentStatus || []}
              placeholder="select status"
              filter="status"
              setFilters={setFilters}
              reset={reset}
            />
          )}

          <Button
            className={`ml-auto ${isDarkMode ? "border-dark-text-base-300-75/60 bg-dark-secondary-200 text-dark-text-base-300" : "text-secondary-100-75"} `}
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
            data={filteredDocuments}
            columns={
              type === "all-documents"
                ? AllDocumentsColumns
                : DraftDocumentsColumns
            }
            globalFilter={globalFilter}
            filters={filters}
            setFilters={setFilters}
            setGlobalFilter={setGlobalFilter}
            pageSize={8}
            columnActions={{
              navigate,
              setOpen,
              setSelectedDocument,
              currentUser,
              isDarkMode,
            }}
          />
        )}
      </div>

      <div
        className={`max-w-[300px] flex-1 space-y-4 border-l border-secondary-200-60 px-7 py-6 ${isDarkMode ? "bg-dark-base-bg" : "bg-white"} transition-colors duration-150`}
      >
        <div
          className={`cursor-pointer border-l-4 pl-4 text-[0.9rem] ${type === "all-documents" && "border-base-200"}`}
          onClick={() => handleTypeChange("all-documents")}
        >
          <p
            className={
              type === "all-documents"
                ? "font-semibold text-base-200"
                : isDarkMode
                  ? "text-dark-text-base-300-75"
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
                : isDarkMode
                  ? "text-dark-text-base-300-75"
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
