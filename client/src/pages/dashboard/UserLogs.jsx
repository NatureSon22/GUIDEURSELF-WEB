import DataTable from "@/components/DataTable";
import { useState } from "react";
import UserLog from "@/components/columns/UserLogs.jsx";

const UserLogs = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [reset, setReset] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <DataTable
      data={[]}
      columns={UserLog}
      filters={filters}
      setFilters={setFilters}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
    />
  );
};

export default UserLogs;
