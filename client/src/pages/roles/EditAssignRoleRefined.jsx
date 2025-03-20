import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRoleById } from "@/api/role";
import { updateAccountRoleType } from "@/api/accounts";
import { getAllRoleTypes } from "@/api/component-info";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ComboBox from "@/components/ComboBox";
import PERMISSIONS from "@/data/permissions";
import PermissionSkeleton from "./PermissionSkeleton";
import Permissions from "@/components/Permissions";

const EditAssignRole = () => {
  const { state } = useLocation();
  const { accountIds = [] } = state || {};
  const navigate = useNavigate();
  const { toast } = useToast();

  const [roleType, setRoleType] = useState(state?.roleId || "");
  const [groundPermissions, setGroundPermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [grantedPermissions, setGrantedPermissions] = useState([]);
  const [revokedPermissions, setRevokedPermissions] = useState([]);
  const [customize, setCustomize] = useState(false);

  // Fetch all available roles
  const { data: allRoles = [], isError: allRolesError } = useQuery({
    queryKey: ["allRoles"],
    queryFn: getAllRoleTypes,
  });

  // Fetch role details for the selected role
  const {
    data: roleDetails,
    isError: roleDetailsError,
    isLoading: roleDetailsLoading,
  } = useQuery({
    queryKey: ["roleDetails", roleType],
    queryFn: () => getRoleById(roleType),
    enabled: !!roleType,
  });

  // Update role permissions mutation
  const { mutateAsync: updateRolePermission, isLoading: isUpdating } =
    useMutation({
      mutationFn: () => {
        if (!accountIds.length || !roleType) {
          throw new Error("Missing required fields");
        }

        return Promise.all(
          accountIds.map((accountId) =>
            updateAccountRoleType(
              accountId,
              roleType,
              grantedPermissions,
              revokedPermissions,
            ),
          ),
        );
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Role permissions updated successfully",
        });
        navigate("/roles-permissions");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update role permissions",
        });
      },
    });

  // Initialize permissions when role details change
  useEffect(() => {
    if (roleDetails?.permissions) {
      setGroundPermissions(roleDetails.permissions);
      setPermissions(roleDetails.permissions);
    }
  }, [roleDetails]);

  // Update effective permissions when any permission-related state changes
  useEffect(() => {
    if (!groundPermissions.length) return;

    let updatedPermissions = groundPermissions.map((module) => {
      const modulePermissions = { ...module };
      const moduleLower = module.module.toLowerCase();

      // ✅ Add granted permissions if they exist
      const grantedForModule = grantedPermissions.find(
        (p) => p.module.toLowerCase() === moduleLower,
      );
      if (grantedForModule) {
        modulePermissions.access = Array.from(
          new Set([...modulePermissions.access, ...grantedForModule.access]),
        );
      }

      // ✅ Remove revoked permissions
      const revokedForModule = revokedPermissions.find(
        (p) => p.module.toLowerCase() === moduleLower,
      );
      if (revokedForModule) {
        modulePermissions.access = modulePermissions.access.filter(
          (access) => !revokedForModule.access.includes(access),
        );
      }

      return modulePermissions;
    });

    // ✅ Step 2: Add new granted modules (not in `groundPermissions`)
    grantedPermissions.forEach((grantedModule) => {
      const exists = updatedPermissions.some(
        (p) => p.module.toLowerCase() === grantedModule.module.toLowerCase(),
      );

      if (!exists) {
        updatedPermissions.push({
          module: grantedModule.module,
          access: [...grantedModule.access], // ✅ Add newly granted module
        });
      }
    });

    // ✅ Step 3: Ensure revoked modules are fully removed if no permissions remain
    updatedPermissions = updatedPermissions.filter(
      (module) => module.access.length > 0,
    );

    setPermissions(updatedPermissions);
  }, [groundPermissions, grantedPermissions, revokedPermissions])

  const handleSetPermissions = (module, access, checked) => {
    if (!customize) return;

    const moduleLower = module.toLowerCase();
    const isGroundPermission = groundPermissions.some(
      (p) =>
        p.module.toLowerCase() === moduleLower && p.access.includes(access),
    );

    if (checked) {
      if (isGroundPermission) {
        // Remove from revoked permissions
        setRevokedPermissions((prev) =>
          prev
            .map((p) => {
              if (p.module.toLowerCase() === moduleLower) {
                const filteredAccess = p.access.filter((a) => a !== access);
                return filteredAccess.length
                  ? { ...p, access: filteredAccess }
                  : null;
              }
              return p;
            })
            .filter(Boolean),
        );
      } else {
        // Add to granted permissions
        setGrantedPermissions((prev) => {
          const existingModule = prev.find(
            (p) => p.module.toLowerCase() === moduleLower,
          );
          if (existingModule) {
            return prev.map((p) => {
              if (p.module.toLowerCase() === moduleLower) {
                return {
                  ...p,
                  access: Array.from(new Set([...p.access, access])),
                };
              }
              return p;
            });
          }
          return [...prev, { module, access: [access] }];
        });
      }
    } else {
      if (isGroundPermission) {
        // Add to revoked permissions
        setRevokedPermissions((prev) => {
          const existingModule = prev.find(
            (p) => p.module.toLowerCase() === moduleLower,
          );
          if (existingModule) {
            return prev.map((p) => {
              if (p.module.toLowerCase() === moduleLower) {
                return {
                  ...p,
                  access: Array.from(new Set([...p.access, access])),
                };
              }
              return p;
            });
          }
          return [...prev, { module, access: [access] }];
        });
      } else {
        // Remove from granted permissions
        setGrantedPermissions((prev) =>
          prev
            .map((p) => {
              if (p.module.toLowerCase() === moduleLower) {
                const filteredAccess = p.access.filter((a) => a !== access);
                return filteredAccess.length
                  ? { ...p, access: filteredAccess }
                  : null;
              }
              return p;
            })
            .filter(Boolean),
        );
      }
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
              disabled={!roleType}
            />
            <Label>Customize permissions</Label>
          </div>
        </div>

        {roleDetailsLoading ? (
          <div className="mt-5 space-y-4">
            <PermissionSkeleton />
            <PermissionSkeleton />
            <PermissionSkeleton />
          </div>
        ) : (
          <div className="my-5 w-full overflow-y-auto rounded-sm border [&_>*+*]:border-t">
            {PERMISSIONS.map((module, index) => {
              const rolePermissions = permissions.find(
                (permission) =>
                  permission.module.toLowerCase() ===
                  module.module.toLowerCase(),
              );

              return (
                <Permissions
                  key={index}
                  module={module}
                  roleaccess={rolePermissions?.access || []}
                  handleSetPermissions={handleSetPermissions}
                  style="bg-white"
                  disableToggle={!customize}
                  customizePermission={customize}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="ml-auto space-x-2 pb-7">
        <Button
          variant="ghost"
          className="text-base-200"
          onClick={() => navigate("/roles-permissions")}
          disabled={isUpdating}
        >
          Return
        </Button>
        <Button
          className="bg-base-200"
          onClick={() => updateRolePermission()}
          disabled={isUpdating || !roleType || !accountIds.length}
        >
          Assign
        </Button>
      </div>
    </div>
  );
};

export default EditAssignRole;
