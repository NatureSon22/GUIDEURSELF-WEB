import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import ComboBox from "@/components/ComboBox";
import Permissions from "@/components/Permissions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PERMISSIONS from "@/data/permissions";
import { getRoleById } from "@/api/role";
import { getAllRoleTypes } from "@/api/component-info";
import { updateAccountRoleType } from "@/api/accounts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Loading from "@/components/Loading";

const EditAssignRole = () => {
  const { accountId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { toast } = useToast();

  const [roleType, setRoleType] = useState(state?.roleId || "");
  const [groundPermissions, setGroundPermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [grantedPermissions, setGrantedPermissions] = useState([]);
  const [revokedPermissions, setRevokePermissions] = useState([]);
  const [customize, setCustomize] = useState(false);

  const { data: allRoles, isError: allRolesError } = useQuery({
    queryKey: ["allRoles"],
    queryFn: getAllRoleTypes,
  });

  const {
    data: roleDetails,
    isLoading: roleDetailsLoading,
    isError: roleDetailsError,
  } = useQuery({
    queryKey: ["roleDetails", roleType],
    queryFn: () => getRoleById(roleType),
    enabled: !!roleType,
  });

  const { mutateAsync: updateRolePermission, isLoading: isUpdating } =
    useMutation({
      mutationFn: () => updateAccountRoleType(accountId, roleType),
      onSuccess: (data) => {
        toast({ title: "Success", description: data.message });
        navigate("/roles-permissions");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      },
    });

  useEffect(() => {
    if (roleDetails?.permissions) {
      setPermissions(roleDetails.permissions);
      setGroundPermissions(roleDetails.permissions);
    }
  }, [roleDetails]);

  const handleReturnClick = () => navigate("/roles-permissions");

  // console.log("granted");
  // console.table(grantedPermissions);
  // console.log("revoked");
  // console.table(revokedPermissions);

  const handleSetPermissions = (
    module,
    access,
    checked,
    setAsCheckAll = true,
  ) => {
    const isDefaultPermission = groundPermissions.some(
      (item) => item.module === module && item.access.includes(access),
    );

    if (checked) {
      // Handling granting permissions
      setGrantedPermissions((prevGrantedPermissions) => {
        const updatedGrantedPermissions = [...prevGrantedPermissions];
        const moduleIndex = updatedGrantedPermissions.findIndex(
          (item) => item.module === module,
        );

        if (moduleIndex >= 0) {
          // Add access if not already present
          if (!updatedGrantedPermissions[moduleIndex].access.includes(access)) {
            updatedGrantedPermissions[moduleIndex].access.push(access);
          }
        } else {
          // Add a new module with access
          updatedGrantedPermissions.push({
            module,
            access: [access],
          });
        }

        return updatedGrantedPermissions;
      });

      setRevokePermissions((prevRevokedPermissions) => {
        const updatedRevokedPermissions = [...prevRevokedPermissions];
        const moduleIndex = updatedRevokedPermissions.findIndex(
          (item) => item.module === module,
        );

        if (moduleIndex >= 0) {
          updatedRevokedPermissions[moduleIndex].access =
            updatedRevokedPermissions[moduleIndex].access.filter(
              (acc) => acc !== access,
            );

          // Remove the module if no access remains
          if (updatedRevokedPermissions[moduleIndex].access.length === 0) {
            updatedRevokedPermissions.splice(moduleIndex, 1);
          }
        }

        return updatedRevokedPermissions;
      });
    } else {
      // Handling revoking permissions
      if (!isDefaultPermission) {
        setRevokePermissions((prevRevokedPermissions) => {
          const updatedRevokedPermissions = [...prevRevokedPermissions];
          const moduleIndex = updatedRevokedPermissions.findIndex(
            (item) => item.module === module,
          );

          if (moduleIndex >= 0) {
            if (
              !updatedRevokedPermissions[moduleIndex].access.includes(access)
            ) {
              updatedRevokedPermissions[moduleIndex].access.push(access);
            }
          } else {
            updatedRevokedPermissions.push({
              module,
              access: [access],
            });
          }

          return updatedRevokedPermissions;
        });
      }

      setGrantedPermissions((prevGrantedPermissions) => {
        const updatedGrantedPermissions = [...prevGrantedPermissions];
        const moduleIndex = updatedGrantedPermissions.findIndex(
          (item) => item.module === module,
        );

        if (moduleIndex >= 0) {
          updatedGrantedPermissions[moduleIndex].access =
            updatedGrantedPermissions[moduleIndex].access.filter(
              (acc) => acc !== access,
            );

          // Remove the module if no access remains
          if (updatedGrantedPermissions[moduleIndex].access.length === 0) {
            updatedGrantedPermissions.splice(moduleIndex, 1);
          }
        }

        return updatedGrantedPermissions;
      });
    }
  };

  if (allRolesError || roleDetailsError) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Failed to load data. Please try again.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-7">
      <div className="space-y-2">
        <p className="font-medium">Role</p>
        <div className="space-y-2">
          <p className="text-[0.9rem] text-base-300/50">
            Update the role for the user and customize their permissions to
            manage specific areas or tasks as needed.
          </p>
          <ComboBox
            options={allRoles}
            placeholder="Select role"
            value={roleType}
            onChange={setRoleType}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <p className="font-medium">Permissions</p>
          <div className="flex items-center gap-2">
            <Checkbox
              className="border-secondary-200"
              checked={customize}
              onCheckedChange={setCustomize}
            />
            <Label>Customize permissions</Label>
          </div>
        </div>

        {roleDetailsLoading ? (
          <Loading />
        ) : (
          <div className="grid gap-4">
            <div className="my-5 w-full overflow-y-auto border">
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
                    disableToggle={!customize}
                    customizePermission={customize}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!roleDetailsLoading && (
        <div className="ml-auto space-x-2 pb-7">
          <Button
            variant="ghost"
            className="text-base-200"
            onClick={handleReturnClick}
          >
            Return
          </Button>
          <Button
            className="bg-base-200"
            onClick={updateRolePermission}
            disabled={isUpdating}
          >
            Assign
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditAssignRole;
