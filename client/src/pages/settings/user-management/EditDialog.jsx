import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  deleteRolePermission,
  getRoleById,
  updateRolePermissions,
} from "@/api/role";
import PERMISSIONS from "@/data/permissions";
import { useToast } from "@/hooks/use-toast";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import Permissions from "@/components/Permissions";

const EditDialog = ({ type, role_id, children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const [permissions, setPermissions] = useState([]);
  const [enableAllCampus, setEnableAllCampus] = useState(false);

  const {
    data: roleDetails,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["roleDetails", role_id],
    queryFn: () => getRoleById(role_id),
    enabled: !!role_id,
  });

  useEffect(() => {
    if (roleDetails) {
      setPermissions(roleDetails.permissions || []);
      setEnableAllCampus(roleDetails.isMultiCampus || false);
    }
  }, [roleDetails]);

  const { mutateAsync: updateRolePermission, isPending } = useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries([
        "rolesWithPermissions",
        "rolesWithoutPermissions",
      ]);
      toast({
        title: "Permissions Updated",
        description: "Role permissions updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role permissions",
      });
    },
    onSettled: () => {
      setIsOpen(false);
      setPermissions([]);
    },
  });

  const { mutateAsync: deleteRole, isPending: isDeleting } = useMutation({
    mutationFn: deleteRolePermission,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "rolesWithPermissions",
        "rolesWithoutPermissions",
      ]);
      toast({
        title: "Permissions Deleted",
        description: "Role permissions deleted successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete role permissions",
      });
    },
    onSettled: () => {
      setIsOpen(false);
    },
  });

  const handleCancel = () => setIsOpen(false);

  const handleSetPermissions = (module, access, checked) => {
    setPermissions((prev) => {
      if (checked) {
        const moduleIndex = prev.findIndex((item) => item.module === module);
        if (moduleIndex === -1) {
          return [...prev, { module, access: [access] }];
        } else {
          const updatedPermissions = [...prev];
          updatedPermissions[moduleIndex].access.push(access);
          return updatedPermissions;
        }
      } else {
        return prev
          .map((item) =>
            item.module === module
              ? { ...item, access: item.access.filter((acc) => acc !== access) }
              : item,
          )
          .filter((item) => item.access.length > 0);
      }
    });
  };

  const handleSave = () => {
    const formData = new FormData();

    if (type === "delete") {
      formData.append("role_id", role_id);
      deleteRole(formData);

      return;
    }

    formData.append("role_id", role_id);
    formData.append("isMultiCampus", enableAllCampus);
    formData.append("permissions", JSON.stringify(permissions));

    updateRolePermission(formData);
  };

  if (isError) {
    return (
      <Button
        variant="secondary"
        className="bg-base-200/10 text-base-200"
        disabled
      >
        Error
      </Button>
    );
  }

  if (isLoading) {
    return type === "delete" ? (
      <Button
        variant="destructive"
        className="group rounded-full bg-accent-100/10 px-[0.65rem]"
      >
        <MdDelete className="text-accent-100 group-hover:text-white" />
      </Button>
    ) : (
      <Button
        variant="secondary"
        className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
      >
        <BiSolidEdit />
        Edit
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="grid gap-4 md:max-w-[900px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>
            {type === "delete"
              ? "Delete Role Permissions"
              : " Edit Permissions"}
          </DialogTitle>
          <DialogDescription>
            {type === "delete"
              ? "Are you sure you want to delete this role? This action cannot be undone."
              : "Edit permissions for this role"}
          </DialogDescription>
        </DialogHeader>

        {/* Role Type Display */}
        <div>
          <p className="w-max rounded-md bg-secondary-100-75/50 px-4 py-2 text-white">
            {roleDetails?.role_type.toUpperCase()}
          </p>
        </div>

        {/* Multi-Campus Handling */}
        <div className="container my-5 max-h-[400px] overflow-y-auto border">
          <div className="bg-secondary-200/5 px-5 py-6">
            <Label>Enable Multiple Campus Handling</Label>
            <p className="text-[0.85rem]">
              Apply this permission across all assigned campuses, expanding
              access while still respecting campus-specific restrictions.
            </p>

            <RadioGroup
              className="ml-5 mt-5 space-y-2"
              value={String(enableAllCampus)}
              onValueChange={(value) => setEnableAllCampus(value === "true")}
              disabled={type === "delete"}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="r1" />
                <Label
                  className="text-[0.8rem] text-secondary-100-75"
                  htmlFor="r1"
                >
                  Enable for All Assigned Campuses
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="r2" />
                <Label
                  className="text-[0.8rem] text-secondary-100-75"
                  htmlFor="r2"
                >
                  Restrict to Primary Campus Only
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Permissions Section */}
          {PERMISSIONS.map((module, i) => {
            const rolePermissions = permissions.find(
              (permission) =>
                permission.module.toLowerCase() === module.module.toLowerCase(),
            );

            return (
              <Permissions
                key={i}
                module={module}
                roleaccess={rolePermissions?.access}
                handleSetPermissions={handleSetPermissions}
                customizePermission={type !== "delete"}
                disableToggle={type === "delete"}
              />
            );
          })}
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex justify-end gap-3">
          <Button
            className="text-base-200"
            variant="ghost"
            onClick={handleCancel}
            disabled={isLoading || isPending || isDeleting}
          >
            Cancel
          </Button>
          <Button
            className="bg-base-200"
            type="submit"
            onClick={handleSave}
            disabled={isLoading || isPending || isDeleting}
          >
            {type === "delete" ? "Delete" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

EditDialog.propTypes = {
  children: PropTypes.node,
  role_id: PropTypes.string,
  type: PropTypes.string,
};

export default EditDialog;
