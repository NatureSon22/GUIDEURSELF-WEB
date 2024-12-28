import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import PERMISSIONS from "@/data/permissions";
import Permissions from "@/components/Permissions";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRoleById } from "@/api/role";

const EditAssignRole = () => {
  const {
    state: { roleId },
  } = useLocation();

  const [permissions, setPermissions] = useState([]);
  const { data: roleDetails, isLoading } = useQuery({
    queryKey: ["roleDetails", roleId],
    queryFn: () => getRoleById(roleId),
  });

  useEffect(() => {
    if (roleDetails?.permissions) {
      setPermissions(roleDetails.permissions);
    }
  }, [roleDetails]);

  const handleSetPermissions = (module, access, checked) => {
    setPermissions((prev) => {
      const updatedPermissions = [...prev];
      const moduleIndex = updatedPermissions.findIndex(
        (item) => item.module === module,
      );

      if (checked) {
        if (moduleIndex === -1) {
          updatedPermissions.push({ module, access: [access] });
        } else {
          if (!updatedPermissions[moduleIndex].access.includes(access)) {
            updatedPermissions[moduleIndex].access.push(access);
          }
        }
      } else {
        if (moduleIndex !== -1) {
          updatedPermissions[moduleIndex].access = updatedPermissions[
            moduleIndex
          ].access.filter((acc) => acc !== access);

          if (updatedPermissions[moduleIndex].access.length === 0) {
            updatedPermissions.splice(moduleIndex, 1);
          }
        }
      }

      return updatedPermissions;
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-5">
      <div className="space-y-2">
        <p className="font-medium">Role</p>

        <div className="space-y-2">
          <p className="text-[0.9rem] text-base-300/50">
            Update the role for the user and customize their permissions to
            manage specific areas or tasks as needed.
          </p>

          <ComboBox options={[]} placeholder="Select role" />
        </div>
      </div>

      <div>
        <p className="font-medium">Permissions</p>

        <div className="grid gap-4">
          <div className="container my-5 overflow-y-auto border">
            {PERMISSIONS.map((module, i) => {
              const rolePermissions = permissions.find(
                (permission) =>
                  permission.module.toLowerCase() ===
                  module.module.toLowerCase(),
              );

              return (
                <Permissions
                  key={i}
                  module={module}
                  roleaccess={rolePermissions?.access}
                  handleSetPermissions={handleSetPermissions}
                  style="bg-white"
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="ml-auto space-x-2">
        <Button variant="ghost" className="text-base-200">
          Return
        </Button>
        <Button className="bg-base-200">Assign</Button>
      </div>
    </div>
  );
};

export default EditAssignRole;
