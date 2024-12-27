import { useQuery } from "@tanstack/react-query";
import { getAllRolesWithPermissions } from "@/api/role";
import columns from "@/components/columns/RoleType";
import DataTable from "@/components/DataTable";

const RoleTypeTable = () => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["rolesWithPermissions"],
    queryFn: getAllRolesWithPermissions,
  });

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <DataTable data={roles} columns={columns} showFooter={false} />
  );
};

export default RoleTypeTable;
