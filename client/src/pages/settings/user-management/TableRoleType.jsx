import { useQuery } from "@tanstack/react-query";
import { getAllRolesWithPermissions } from "@/api/role";
import columns from "@/components/columns/RoleType";
import DataTable from "@/components/DataTable";
import { useState } from "react";
import Loading from "@/components/Loading";

const RoleTypeTable = () => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["rolesWithPermissions"],
    queryFn: getAllRolesWithPermissions,
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
      columns={columns}
      filters={filters}
      setFilters={setFilters}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      showFooter={false}
    />
  );
};

export default RoleTypeTable;
