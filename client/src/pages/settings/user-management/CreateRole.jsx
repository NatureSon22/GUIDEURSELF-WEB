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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CreateRole = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const { data: roles } = useQuery({
    queryKey: ["rolesWithoutPermissions"],
    queryFn: getAllRolesWithoutPermissions,
  });
  const [permissions, setPermissions] = useState([]);
  const [enableAllCampus, setEnableAllCampus] = useState(false);
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
      setPermissions([]);
    },
  });

  const handleSave = () => {
    const formData = new FormData();
    formData.append("role_id", roleId);
    formData.append("isMultiCampus", enableAllCampus);
    formData.append("permissions", JSON.stringify(permissions));

    addRolePermission(formData);
  };

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
              <div className="bg-secondary-200/5 px-5 py-6">
                <Label>Enable Multiple Campus Handling</Label>
                <p className="text-[0.85rem]">
                  Apply this permission across all campuses assigned to the
                  user, expanding their access while still respecting their
                  campus-specific restrictions
                </p>

                <RadioGroup
                  className="ml-5 mt-5 space-y-2 fill-base-200"
                  value={String(enableAllCampus)}
                  onValueChange={(value) =>
                    setEnableAllCampus(value === "true")
                  }
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

              {PERMISSIONS.map((module, i) => (
                <Permissions
                  key={i}
                  module={module}
                  roleaccess={permissions}
                  handleSetPermissions={handleSetPermissions}
                  customizePermission={roleId ? true : false}
                  newRole={true}
                  disableToggle={!roleId ? true : false}
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
