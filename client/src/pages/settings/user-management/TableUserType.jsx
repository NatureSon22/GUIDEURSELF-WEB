import { useQuery } from "@tanstack/react-query";
import { getAllRoles } from "@/api/role";
import DataTable from "@/components/DataTable";
import UserTypeColumns from "@/components/columns/UserType";

const TableUserRole = () => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <DataTable data={roles} columns={UserTypeColumns} showFooter={false} />
  );
};

export default TableUserRole;
