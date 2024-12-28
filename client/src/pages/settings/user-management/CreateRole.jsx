import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PERMISSIONS from "@/data/permissions";
import Permissions from "@/components/Permissions";
import { useState } from "react";
import { RiAddLargeFill } from "react-icons/ri";
import ComboBox from "@/components/ComboBox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllRolesWithoutPermissions } from "@/api/role";
import { updateRolePermissions } from "@/api/role";
import { useToast } from "@/hooks/use-toast";

const CreateRole = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const { data: roles } = useQuery({
    queryKey: ["rolesWithoutPermissions"],
    queryFn: getAllRolesWithoutPermissions,
  });
  const [permissions, setPermissions] = useState([]);
  const [roleId, setRoleId] = useState("");
  const { mutateAsync: addRolePermission, isLoading } = useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: (data) => {
      setOpenDialog(false);
      queryClient.invalidateQueries([
        "rolesWithPermissions",
        "rolesWithoutPermissions",
      ]);
      toast({
        title: "Success",
        description: data.message,
      });
    },
    onError: () => setOpenDialog(false),
    onSettled: () => {
      setRoleId("");
    },
  });

  const handleSave = () => {
    const formData = new FormData();
    formData.append("role_id", roleId);
    formData.append("permissions", JSON.stringify(permissions));

    addRolePermission(formData);
  };

  const handleSetPermissions = (module, access, checked) => {
    setPermissions((prev) => {
      const updatedPermissions = [...prev];
      const moduleIndex = updatedPermissions.findIndex(
        (item) => item.module === module
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

  return (
    <>
      <Button
        variant="outline"
        className="text-secondary-100-75"
        onClick={() => setOpenDialog(true)}
      >
        <RiAddLargeFill /> Create
      </Button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="grid gap-5 md:max-w-[850px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Set Default Permissions</DialogTitle>
            <DialogDescription>
              Control access and permissions for roles.
              <span className="ml-1 text-secondary-200">
                Note: Only roles without assigned permissions will be displayed.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div>
            <ComboBox
              options={roles}
              placeholder="Select Role"
              onChange={setRoleId}
              value={roleId}
            />

            <div className="container my-5 max-h-[400px] overflow-y-auto border">
              {PERMISSIONS.map((module, i) => (
                <Permissions
                  key={i}
                  module={module}
                  handleSetPermissions={handleSetPermissions}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="ml-auto">
            <Button
              variant="ghost"
              className="text-base-200"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-base-200"
              onClick={handleSave}
              disabled={isLoading || !roleId}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRole;