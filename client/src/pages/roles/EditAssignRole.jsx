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
import { useCallback } from "react";

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
    isFetched: roleDetailsFetched,
  } = useQuery({
    queryKey: ["roleDetails", roleType],
    queryFn: () => getRoleById(roleType),
    enabled: !!roleType,
  });

  const {
    data: accountDetails,
    isLoading: accountLoading,
    isFetched: accountFetched,
  } = useQuery({
    queryKey: ["userDetails", accountId],
    queryFn: () => getAccount(accountId),
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

  useEffect(() => {
    if (accountDetails !== undefined) {
      const { custom_permissions } = accountDetails;
      console.log("Custom Permissions:", custom_permissions);
      console.log("Granted Permissions:", custom_permissions?.granted);
      console.log("Revoked Permissions:", custom_permissions?.revoked);
      // setGrantedPermissions(granted || []);
      // setRevokePermissions(revoked || []);
    }
  }, [accountDetails]);

  const initializePermissions = useCallback(() => {
    if (!accountDetails || !groundPermissions) return;

    console.log("Account Details:", accountDetails);

    // const temp = [...groundPermissions];
    // const {
    //   roleDetails: { granted, revoked },
    // } = accountDetails;
    // const grantedTemp = [...granted];
    // const revokedTemp = [...revoked];

    // grantedTemp.forEach((granted) => {
    //   const moduleIndex = temp.findIndex(
    //     (ground) => ground.module === granted.module,
    //   );

    //   if (moduleIndex >= 0) {
    //     temp[moduleIndex].access.push(granted.access);
    //   } else {
    //     temp.push({
    //       module: granted.module,
    //       access: granted.access,
    //     });
    //   }
    // });

    // revokedTemp.forEach((revoked) => {
    //   const moduleIndex = temp.findIndex(
    //     (ground) => ground.module === revoked.module,
    //   );

    //   temp[moduleIndex].access = temp[moduleIndex].access.filter(
    //     (access) => !revoked.access.includes(access),
    //   );

    //   if (temp[moduleIndex].access.length === 0) {
    //     temp.splice(moduleIndex, 1);
    //   }
    // });

    // console.log("Permissions:", temp);
    // //setPermissions(temp);
  }, [groundPermissions, accountDetails]);

  // useEffect(() => {
  //   initializePermissions();
  // }, [initializePermissions]);

  const handleReturnClick = () => navigate("/roles-permissions");

  const handleSetPermissions = (module, access, checked) => {};

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
