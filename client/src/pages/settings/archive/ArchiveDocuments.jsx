import { Input } from "@/components/ui/input";
import { useState } from "react";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import DataTable from "@/components/DataTable";
import documentColumns from "@/components/columns/ArchiveDocuments";
import { useQuery } from "@tanstack/react-query";
import { getAllCampuses } from "@/api/component-info";
import documentStatus from "@/data/documentStatus";
import { getAllDocuments } from "@/api/documents";

const ArchiveDocuments = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);

  const { data: allDocuments } = useQuery({
    queryKey: ["allDocuments"],
    queryFn: () => getAllDocuments("", "", false, false, true),
  });

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };

  return (
    <div className="flex flex-1 flex-col space-y-5">
      <Input
        type="text"
        placeholder="Search"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      <div className="flex items-center gap-5">
        <p>Filters:</p>
        <DateRangePicker />

        <ComboBox
          options={allCampuses || []}
          placeholder="select campus"
          filter="campus_name"
          setFilters={setFilters}
          reset={reset}
        />
        <ComboBox
          options={documentStatus}
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

      <div className="flex-1">
        <DataTable
          data={allDocuments || []}
          columns={documentColumns}
          filters={filters}
          setFilters={setFilters}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnActions={{}}
        />
      </div>
    </div>
  );
};

export default ArchiveDocuments;
