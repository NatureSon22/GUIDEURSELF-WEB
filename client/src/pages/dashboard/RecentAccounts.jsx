import { useState } from "react";
import DataTable from "@/components/DataTable";
import Accounts from "@/components/columns/Accounts";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/api/accounts";
import Loading from "@/components/Loading";

const RecentAccounts = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const {
    data: allAccounts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recent-accounts"],
    queryFn: () => getAllAccounts(10),
    refetchOnWindowFocus: false,
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
      data={allAccounts || []}
      columns={Accounts}
      filters={filters}
      setFilters={setFilters}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      columnActions={{ hasAction: false }}
      showFooter={false}
    />
  );
};

export default RecentAccounts;
