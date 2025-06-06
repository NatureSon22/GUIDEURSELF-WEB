import { Input } from "@/components/ui/input";
import { useState } from "react";
import CreateCategoryRole from "./CreateCategoryRole";
import TableCategoryRole from "./TableCategoryRole";
import useToggleTheme from "@/context/useToggleTheme";

const UserCategoryTypeManagement = () => {
  const [type, setType] = useState("");
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <div>
      <div className="flex gap-4">
        <Input
          value={type}
          className={`${isDarkMode ? "border-transparent bg-dark-secondary-100-75/20 text-dark-text-base-300-75 !placeholder-dark-secondary-100-75" : ""}`}
          onChange={(e) => setType(e.target.value)}
          placeholder="Search"
        />
        <CreateCategoryRole />
      </div>

      <TableCategoryRole type={type} setType={setType} />
    </div>
  );
};

export default UserCategoryTypeManagement;
