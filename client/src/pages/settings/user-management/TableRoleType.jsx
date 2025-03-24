import { useQuery } from "@tanstack/react-query";
import { getAllRolesWithPermissions } from "@/api/role";
import columns from "@/components/columns/RoleType";
import DataTable from "@/components/DataTable";
import { useState } from "react";
import Loading from "@/components/Loading";
import PropTypes from "prop-types";

const RoleTypeTable = ({ globalFilter, setGlobalFilter }) => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["rolesWithPermissions"],
    queryFn: getAllRolesWithPermissions,
  });

  const [filters, setFilters] = useState([]);

  return isLoading ? (
    <div className="flex justify-center items-center h-64">
      <Loading />
    </div>
  ) : (
    <DataTable
      data={roles || []}
      columns={columns}
      filters={filters}
      setFilters={setFilters}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      pageSize={5}
      showFooter={true}
    />
  );
};


RoleTypeTable.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
};

export default RoleTypeTable;
