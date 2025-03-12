import { Input } from "@/components/ui/input";
import CreateUserType from "./CreateUserType";
import TableUserType from "./TableUserType";
import { useState } from "react";

const UserTypeManagement = () => {
  const [type, setType] = useState("");

  return (
    <div>
      <div className="flex gap-4">
        <Input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Name of the user type"
        />
        <CreateUserType />
      </div>

      <TableUserType type={type} setType={setType} />
    </div>
  );
};

export default UserTypeManagement;
