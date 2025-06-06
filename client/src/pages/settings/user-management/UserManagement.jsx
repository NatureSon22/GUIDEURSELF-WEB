import Header from "@/components/Header";
import UserTypeManagement from "./UserTypeManagement";
import RoleManagement from "./RoleManagement";
import Layout from "@/components/Layout";
import UserCategoryTypeManagement from "./UserCategoryTypeManagement";
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
        subtitle="Organize user types and permissions within the system"
      ></Header>

      <Layout
        title="User Type"
        subtitle="Define categories for system users"
        isEditable={false}
      >
        <UserTypeManagement />
      </Layout>

      <Layout
        title="Role Categories"
        subtitle="Define role categories under each user type"
        isEditable={false}
      >
        <UserCategoryTypeManagement />
      </Layout>

      <Layout
        title="User Permissions"
        subtitle="Manage user type permissions and access"
        isEditable={false}
      >
        <RoleManagement />
      </Layout>
    </div>
  );
};

export default UserManagement;
