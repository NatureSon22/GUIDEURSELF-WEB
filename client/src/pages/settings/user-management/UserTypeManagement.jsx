import { Input } from "@/components/ui/input";
import CreateUserType from "./CreateUserType";
import TableUserType from "./TableUserType";

const UserTypeManagement = () => {
  return (
    <div>
      <div className="flex gap-4">
        <Input placeholder="Name of the user type" />
        <CreateUserType />
      </div>

      <TableUserType />
    </div>
  );
};

export default UserTypeManagement;
