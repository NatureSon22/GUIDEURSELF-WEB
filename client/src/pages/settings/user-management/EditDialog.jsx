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
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getRoleById } from "@/api/role";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PERMISSIONS from "@/data/permissions";
import Permissions from "@/components/Permissions";
import { updateRolePermissions } from "@/api/role";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const EditDialog = ({ role_id, children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { data: roleDetails, isError } = useQuery({
    queryKey: ["roleDetails", role_id],
    queryFn: () => getRoleById(role_id),
  });
  const { mutateAsync: updateRolePermission } = useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: (data) => {
      setIsOpen(false);
      queryClient.invalidateQueries([
        "rolesWithPermissions",
        "rolesWithoutPermissions",
      ]);
      toast({
        title: "Success",
        description: data.message,
      });
    },
    onError: () => setIsOpen(false),
  });

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (roleDetails?.permissions) {
      setPermissions(roleDetails.permissions);
    }
  }, [roleDetails]);

  const handleCancel = () => {
    setIsOpen(false);
  };

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
    formData.append("role_id", role_id);
    formData.append("permissions", JSON.stringify(permissions));

    updateRolePermission(formData);
  };

  if (isError)
    return (
      <Button
        variant="secondary"
        className="bg-base-200/10 text-base-200"
        disabled
      ></Button>
    );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="grid gap-4 md:max-w-[850px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>
            <p>Edit Permissions</p>
          </DialogTitle>
          <DialogDescription>
            Control access and permissions for roles.
          </DialogDescription>
        </DialogHeader>

        <div>
          <p className="w-min rounded-md bg-secondary-100-75 px-4 py-2 text-white">
            {roleDetails?.role_type.toUpperCase()}
          </p>
        </div>

        <div className="grid gap-4 pb-4">
          <div className="container my-5 max-h-[400px] overflow-y-auto border">
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
                  customizePermission={true}
                />
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-4">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

EditDialog.propTypes = {
  role_id: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default EditDialog;
