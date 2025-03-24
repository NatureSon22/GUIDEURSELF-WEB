import { Input } from "@/components/ui/input";
import CreateRole from "./CreateRole";
import RoleTypeTable from "./TableRoleType";
import { useState } from "react";

const RoleManagement = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <div>
      <div className="flex gap-4">
        <Input
          placeholder="Name of the user type"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <CreateRole />
      </div>

      <RoleTypeTable
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
};

export default RoleManagement;
