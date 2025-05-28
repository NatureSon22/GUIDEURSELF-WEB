import { Input } from "@/components/ui/input";
import { useState } from "react";
import CreateCategoryRole from "./CreateCategoryRole";
import TableCategoryRole from "./TableCategoryRole";

const UserCategoryTypeManagement = () => {
  const [type, setType] = useState("");

  return (
    <div>
      <div className="flex gap-4">
        <Input
          value={type}
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
