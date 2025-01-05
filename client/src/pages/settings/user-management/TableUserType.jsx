import { useQuery } from "@tanstack/react-query";
import { getAllRoles } from "@/api/role";
import DataTable from "@/components/DataTable";
import UserTypeColumns from "@/components/columns/UserType";
import { useState } from "react";
import Loading from "@/components/Loading";

const TableUserRole = () => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);

  return isLoading ? (
    <div className="py-12">
      <Loading></Loading>
    </div>
  ) : (
    <DataTable
      data={roles}
      columns={UserTypeColumns}
      filters={filters}
      setFilters={setFilters}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      showFooter={false}
    />
  );
};

export default TableUserRole;
