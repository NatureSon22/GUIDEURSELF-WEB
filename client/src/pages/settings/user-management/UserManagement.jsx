import Header from "@/components/Header";
import UserTypemanagement from "./UserTypeManagement";
import RoleManagement from "./RoleManagement";
const UserManagement = () => {
  //   {
  //      "_id": {"$oid":"67659bcb685b0e8c2f8beeb0"},
  //      "role_type":"administrator",
  //      "permissions":  [
  //        {
  //          "module":"role-management",
  //          "access":["add-role","edit-role","get-role","delete-role"]
  //        }
  //      ]
  //   }

  return (
    <div className="space-y-5">
      <Header
        title="User Management"
        subtitle="Organize user roles, types, and permissions within the system"
      ></Header>

      <div className="space-y-4 rounded-lg border border-secondary-200-60 bg-white px-4 py-6">
        <div className="space-y-1">
          <p className="font-medium">User Type</p>
          <p className="text-[0.9rem]">Define categories for system users</p>
        </div>

        <p className="font-medium">New User Type</p>

        <UserTypemanagement />
      </div>

      <div className="space-y-4 rounded-lg border border-secondary-200-60 bg-white px-4 py-6">
        <div className="space-y-1">
          <p className="font-medium">Role</p>
          <p className="text-[0.9rem]">
            Establish user roles with specific responsibilities
          </p>
        </div>

        <p className="font-medium">Create Role</p>
        <RoleManagement />
      </div>
    </div>
  );
};

export default UserManagement;
