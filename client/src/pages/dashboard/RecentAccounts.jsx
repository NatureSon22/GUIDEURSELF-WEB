import { useState } from "react";
import DataTable from "@/components/DataTable";
import Accounts from "@/components/columns/Accounts";

const RecentAccounts = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <DataTable
      data={[]}
      columns={Accounts}
      filters={filters}
      setFilters={setFilters}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      showFooter={false}
    />
  );
};

export default RecentAccounts;
