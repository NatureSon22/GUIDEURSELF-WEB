import Header from "@/components/Header";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiAddLargeFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTable";
import { GrPowerReset } from "react-icons/gr";
import Loading from "@/components/Loading";
import { LuDownload } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import AllDocumentsColumns from "@/components/columns/AllDocuments";
import DraftDocumentsColumns from "@/components/columns/DraftsDocument";
import ComboBox from "@/components/ComboBox";
import { getAllRoleTypes, getAllCampuses } from "@/api/component-info";
import DateRangePicker from "@/components/DateRangePicker";

const AllDocuments = () => {
  const [type, setType] = useState("all-documents");
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [reset, setReset] = useState(false);

  const navigate = useNavigate();

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };

  return (
    <div className="flex gap-8">
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
              onClick={() => handleNavigate("/accounts/add-account")}
            >
              <RiAddLargeFill /> Create Document
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <p>Filters:</p>
          <DateRangePicker />
          <ComboBox
            options={[]}
            placeholder="select user type"
            filter="role_type"
            setFilters={setFilters}
            reset={reset}
          />
          <ComboBox
            options={[]}
            placeholder="select campus"
            filter="campus_name"
            setFilters={setFilters}
            reset={reset}
          />
          <ComboBox
            options={[]}
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

        <DataTable
          data={[]}
          columns={
            type === "all-documents"
              ? AllDocumentsColumns
              : DraftDocumentsColumns
          }
          globalFilter={globalFilter}
          filters={filters}
        />
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
    </div>
  );
};

export default AllDocuments;
