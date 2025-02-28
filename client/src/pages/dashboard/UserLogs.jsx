import DataTable from "@/components/DataTable";
import { useState } from "react";
import UserLog from "@/components/columns/UserLogs.jsx";
import { useQuery } from "@tanstack/react-query";
import { getAllActLog } from "@/api/component-info";
import Loading from "@/components/Loading";

const UserLogs = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const {
    data: activityLogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["activitylogs"],
    queryFn: getAllActLog,
  });

  if (isError) {
    return (
      <div className="grid h-52 place-items-center text-secondary-100-75">
        <p>Failed to fetch activity logs</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid h-52 place-items-center">
        <Loading />
      </div>
    );
  }

  return (
    <DataTable
      data={activityLogs || []}
      columns={UserLog}
      filters={filters}
      setFilters={setFilters}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      showFooter={false}
    />
  );
};

export default UserLogs;
