import { Input } from "@/components/ui/input";
import CreateRole from "./CreateRole";
import RoleTypeTable from "./TableRoleType";

const RoleManagement = () => {
  return (
    <div>
      <div className="flex gap-4">
        <Input placeholder="Name of the user type" />
        <CreateRole />
      </div>

      <RoleTypeTable />
    </div>
  );
};

export default RoleManagement;
