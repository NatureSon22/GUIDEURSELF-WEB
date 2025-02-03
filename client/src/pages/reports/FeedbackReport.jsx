import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCampuses, getAllRoleTypes } from "@/api/component-info";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import Header from "@/components/Header";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import DataTable from "@/components/DataTable";
import columns from "@/components/columns/FeedbackReport";
import Loading from "@/components/Loading";
import { LuDownload } from "react-icons/lu";

const FeedbackReport = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [reset, setReset] = useState(false);

  const { data: allFeedback, isLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: () => [],
  });

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  const { data: allRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: getAllRoleTypes,
  });

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };

  return (
    <div className={`flex flex-1 flex-col gap-5`}>
      <Header
        title={"User Account Report"}
        subtitle={
          "Access, review, and generate reports on user account records"
        }
      />

      <div className="flex items-center gap-5">
        <p>Filters:</p>
        <DateRangePicker />
        <ComboBox
          options={allRoles}
          placeholder="select user type"
          filter="role_type"
          setFilters={setFilters}
          reset={reset}
        />
        <ComboBox
          options={allCampuses}
          placeholder="select campus"
          filter="campus_name"
          setFilters={setFilters}
          reset={reset}
        />

        <Button
          className="text-secondary-100-75"
          variant="outline"
          onClick={handleReset}
        >
          <GrPowerReset /> Reset Filters
        </Button>

        <div className="ml-auto space-x-5">
          <Button variant="ghost" className="text-base-200">
            File Preview
          </Button>
          <Button className="border border-base-200 bg-base-200/10 text-base-200 shadow-none hover:bg-base-200 hover:text-white">
            <LuDownload />
            Download
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          data={allFeedback}
          columns={columns}
          filters={filters}
          setFilters={setFilters}
          pageSize={11}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnActions={{}}
        />
      )}
    </div>
  );
};

export default FeedbackReport;
