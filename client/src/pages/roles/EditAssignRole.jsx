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
import { getAccount } from "@/api/accounts";
import PermissionSkeleton from "./PermissionSkeleton";

const EditAssignRole = () => {
  const { accountId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [roleType, setRoleType] = useState(state?.roleId || "");
  const [groundPermissions, setGroundPermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [grantedPermissions, setGrantedPermissions] = useState([]);
  const [revokedPermissions, setRevokedPermissions] = useState([]);
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

  const { data: accountDetails } = useQuery({
    queryKey: ["userDetails", accountId],
    queryFn: () => getAccount(accountId),
  });

  const { mutateAsync: updateRolePermission, isLoading: isUpdating } =
    useMutation({
      mutationFn: () => updateAccountRoleType(accountId, roleType),
      onSuccess: (data) => {
        toast({ title: "Success", description: data });
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

  // Set initial ground permissions from role details
  useEffect(() => {
    if (roleDetails?.permissions) {
      setGroundPermissions(roleDetails.permissions);
      setPermissions(roleDetails.permissions);
    }
  }, [roleDetails]);

  // Initialize custom permissions from account details
  useEffect(() => {
    if (accountDetails?.custom_permissions) {
      const { granted = [], revoked = [] } = accountDetails.custom_permissions;
      setGrantedPermissions(granted);
      setRevokedPermissions(revoked);
    }
  }, [accountDetails]);

  // Update permissions when ground permissions, granted, or revoked permissions change
  useEffect(() => {
    if (!groundPermissions.length) return;

    const updatedPermissions = groundPermissions.map((module) => {
      const modulePermissions = { ...module };

      // Add granted permissions
      const grantedForModule = grantedPermissions.find(
        (p) => p.module.toLowerCase() === module.module.toLowerCase(),
      );
      if (grantedForModule) {
        modulePermissions.access = [
          ...new Set([...modulePermissions.access, ...grantedForModule.access]),
        ];
      }

      // Remove revoked permissions
      const revokedForModule = revokedPermissions.find(
        (p) => p.module.toLowerCase() === module.module.toLowerCase(),
      );
      if (revokedForModule) {
        modulePermissions.access = modulePermissions.access.filter(
          (access) => !revokedForModule.access.includes(access),
        );
      }

      return modulePermissions;
    });

    setPermissions(updatedPermissions);
  }, [groundPermissions, grantedPermissions, revokedPermissions]);

  const handleSetPermissions = (module, access, checked) => {
    if (!customize) return;

    const isGroundPermission = groundPermissions.some(
      (p) =>
        p.module.toLowerCase() === module.toLowerCase() &&
        p.access.includes(access),
    );

    if (checked) {
      if (isGroundPermission) {
        // Remove from revoked if it was previously revoked
        setRevokedPermissions((prev) =>
          prev
            .map((p) => {
              if (p.module.toLowerCase() === module.toLowerCase()) {
                return {
                  ...p,
                  access: p.access.filter((a) => a !== access),
                };
              }
              return p;
            })
            .filter((p) => p.access.length > 0),
        );
      } else {
        // Add to granted
        setGrantedPermissions((prev) => {
          const moduleExists = prev.find(
            (p) => p.module.toLowerCase() === module.toLowerCase(),
          );

          if (moduleExists) {
            return prev.map((p) => {
              if (p.module.toLowerCase() === module.toLowerCase()) {
                return {
                  ...p,
                  access: [...new Set([...p.access, access])],
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
        // Add to revoked
        setRevokedPermissions((prev) => {
          const moduleExists = prev.find(
            (p) => p.module.toLowerCase() === module.toLowerCase(),
          );

          if (moduleExists) {
            return prev.map((p) => {
              if (p.module.toLowerCase() === module.toLowerCase()) {
                return {
                  ...p,
                  access: [...new Set([...p.access, access])],
                };
              }
              return p;
            });
          }

          return [...prev, { module, access: [access] }];
        });
      } else {
        // Remove from granted if it was previously granted
        setGrantedPermissions((prev) =>
          prev
            .map((p) => {
              if (p.module.toLowerCase() === module.toLowerCase()) {
                return {
                  ...p,
                  access: p.access.filter((a) => a !== access),
                };
              }
              return p;
            })
            .filter((p) => p.access.length > 0),
        );
      }
    }
  };

  const handleUpdateRolePermission = () => {
    // Validate required data
    if (!roleType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a role type",
      });
      return;
    }

    const formData = new FormData();
    formData.append("roleId", roleType);

    // Only append if arrays have content
    // if (grantedPermissions.length > 0) {
    //   formData.append("granted", JSON.stringify(grantedPermissions));
    // }

    // if (revokedPermissions.length > 0) {
    //   formData.append("revoked", JSON.stringify(revokedPermissions));
    // }

    // Log the actual FormData content
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    updateRolePermission(accountId, formData);
  };

  const handleReturnClick = () => navigate("/roles-permissions");

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
          <div className="mt-5 space-y-4">
            <PermissionSkeleton />
            <PermissionSkeleton />
            <PermissionSkeleton />
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="my-5 w-full overflow-y-auto rounded-sm border [&_>*+*]:border-t">
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
                    roleaccess={rolePermissions?.access || []}
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
            disabled={isUpdating}
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
