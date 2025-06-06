import { Input } from "@/components/ui/input";
import CreateRole from "./CreateRole";
import RoleTypeTable from "./TableRoleType";
import { useState } from "react";
import useToggleTheme from "@/context/useToggleTheme";

const RoleManagement = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <div>
      <div className="flex gap-4">
        <Input
          placeholder="Search"
          className={`${isDarkMode ? "border-transparent bg-dark-secondary-100-75/20 text-dark-text-base-300-75 !placeholder-dark-secondary-100-75" : ""}`}
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
