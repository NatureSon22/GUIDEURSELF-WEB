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
import useToggleTheme from "@/context/useToggleTheme";

const EditAssignRole = () => {
  const { accountId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [roleType, setRoleType] = useState(location.state?.roleId || "");
  const [groundPermissions, setGroundPermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [grantedPermissions, setGrantedPermissions] = useState([]);
  const [revokedPermissions, setRevokedPermissions] = useState([]);
  const [customize, setCustomize] = useState(false);
  const { isDarkMode } = useToggleTheme((state) => state);

  const { data: allRoles, isError: allRolesError } = useQuery({
    queryKey: ["allRoles"],
    queryFn: () => getAllRoleTypes([], true),
  });

  const {
    data: roleDetails,
    isLoading: roleDetailsLoading,
    isError: roleDetailsError,
  } = useQuery({
    queryKey: ["roleDetails", roleType, accountId],
    queryFn: () => getRoleById(roleType),
    enabled: !!roleType, // Only fetch if roleType is selected
  });

  const { data: accountDetails, isLoading: accountLoading } = useQuery({
    queryKey: ["userDetails", accountId],
    queryFn: () => getAccount(accountId),
  });

  const { mutateAsync: updateRolePermission, isLoading: isUpdating } =
    useMutation({
      mutationFn: () =>
        updateAccountRoleType(
          accountId,
          roleType,
          grantedPermissions,
          revokedPermissions,
        ),
      onSuccess: () => {
        toast({
          title: "Success",
          description: "User permissions updated successfully",
        });
        navigate("/user-permissions");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      },
    });

  // Reset permissions when the selected role changes
  useEffect(() => {
    setCustomize(false);
    setGroundPermissions([]);
    setPermissions([]);
    setGrantedPermissions([]);
    setRevokedPermissions([]);
  }, [roleType]);

  // Set initial ground permissions from role details
  useEffect(() => {
    if (roleDetails?.permissions) {
      setGroundPermissions(roleDetails.permissions);
    }
  }, [roleDetails]);

  // Initialize custom permissions from account details
  useEffect(() => {
    if (!accountLoading && accountDetails?.custom_permissions) {
      const { granted = [], revoked = [] } = accountDetails.custom_permissions;
      setGrantedPermissions(granted);
      setRevokedPermissions(revoked);
    }
  }, [accountLoading, accountDetails]);

  //Update permissions when ground permissions, granted, or revoked permissions change
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
  }, [groundPermissions, grantedPermissions, revokedPermissions]);

  const handleReset = () => {
    setCustomize(false);
    if (roleDetails?.permissions) {
      setGroundPermissions(roleDetails.permissions);
    }
    setGrantedPermissions([]);
    setRevokedPermissions([]);
  };

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

  const handleReturnClick = () => navigate("/user-permissions");

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
        <p
          className={`font-medium ${isDarkMode ? "text-dark-text-base-300" : ""} `}
        >
          Edit Permissions
        </p>
        <div className="space-y-2">
          <p
            className={`mb-[2px] text-[0.9rem] ${isDarkMode ? "text-dark-text-base-300-75" : "text-base-300/50"}`}
          >
            Assign and customize permissions for each user type to manage
            specific areas or tasks within the system based on their
            responsibilities
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
          <p
            className={`font-medium ${isDarkMode ? "text-dark-text-base-300" : ""} `}
          >
            Permissions
          </p>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Checkbox
                className="border-secondary-200"
                checked={customize}
                onCheckedChange={setCustomize}
              />
              <Label className={isDarkMode ? "text-dark-text-base-300" : ""}>
                Customize permissions
              </Label>
            </div>

            <Button
              className={
                isDarkMode ? "border border-dark-secondary-100-75" : ""
              }
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

        {roleDetailsLoading ? (
          <div className={"mt-5 space-y-4"}>
            <PermissionSkeleton />
            <PermissionSkeleton />
            <PermissionSkeleton />
          </div>
        ) : (
          <div className="grid gap-4">
            <div
              className={`my-5 w-full overflow-y-auto rounded-sm border [&_>*+*]:border-t ${isDarkMode ? "border-dark-text-base-300-75/50" : ""} `}
            >
              {PERMISSIONS.map((module) => {
                const rolePermissions = permissions.find(
                  (permission) =>
                    permission.module.toLowerCase() ===
                    module.module.toLowerCase(),
                ) || { access: [] };

                return (
                  <Permissions
                    key={module.module.toLowerCase()}
                    module={module}
                    roleaccess={rolePermissions.access}
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
