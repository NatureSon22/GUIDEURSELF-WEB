import DataTable from "@/components/DataTable";
import { useState } from "react";
import UserLog from "@/components/columns/UserLogs.jsx";

const UserLogs = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <DataTable
      data={[]}
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
