import { Input } from "@/components/ui/input";
import CreateUserType from "./CreateUserType";
import TableUserType from "./TableUserType";

const UserTypemanagement = () => {
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

export default UserTypemanagement;
