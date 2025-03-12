import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRoleType, getAllRoles, updateRoleName } from "@/api/role";
import DataTable from "@/components/DataTable";
import UserTypeColumns from "@/components/columns/UserType";
import { useRef, useState } from "react";
import Loading from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

const TableUserRole = ({ type, setType }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });

  const [filters, setFilters] = useState([]);
  const [role, setRole] = useState({ role_type: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const inputRef = useRef(null);

  // Mutation for deleting role
  const { mutateAsync: deleteRole, isPending: isDeleting } = useMutation({
    mutationFn: deleteRoleType,
    onSuccess: (message) => {
      toast({
        title: "Role deleted successfully",
        description: message,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete role",
        description: error?.message || "Failed to delete user type.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["roles"]);
      setOpenDialog(false);
      setRole({ role_type: "" });
    },
  });

  const { mutateAsync: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: updateRoleName,
    onSuccess: (message) => {
      toast({
        title: "Role updated successfully",
        description: message,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update role",
        description: error?.message || "Failed to update user type.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["roles"]);
      setOpenDialog(false);
      setRole({ role_type: "" });
    },
  });

  const handleDeleteRole = async () => {
    const form = new FormData();
    form.append("role_id", role._id);
    await deleteRole(form);
  };

  const handleUpdateRole = async () => {
    const form = new FormData();
    form.append("role_id", role._id);
    form.append("role_name", inputRef.current.value);
    await updateRole(form);
  };

  const columnActions = { setRole, setOpenDialog, setActionType };

  return isLoading ? (
    <div className="py-40">
      <Loading />
    </div>
  ) : (
    <>
      <DataTable
        data={roles}
        columns={UserTypeColumns}
        filters={filters}
        setFilters={setFilters}
        globalFilter={type}
        setGlobalFilter={setType}
        pageSize={5}
        showFooter={true}
        columnActions={columnActions}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="grid gap-5 sm:max-w-[425px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>
              {actionType === "delete"
                ? "Delete User Type"
                : "Update User Type"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "delete"
                ? "Are you sure you want to delete this user type?"
                : "You are about to update the user type name."}
            </DialogDescription>
          </DialogHeader>

          {actionType === "delete" ? (
            <p className="rounded-md bg-secondary-100-75/10 px-4 py-2 font-medium">
              {role.role_type.toUpperCase()}
            </p>
          ) : (
            <Input
              id="type"
              value={role.role_type}
              ref={inputRef}
              onChange={(e) =>
                setRole((prev) => ({ ...prev, role_type: e.target.value }))
              }
              placeholder="Enter user type"
              aria-label="User Type"
            />
          )}

          <DialogFooter className="ml-auto mt-2">
            <Button
              variant="ghost"
              onClick={() => setOpenDialog(false)}
              disabled={isDeleting || isUpdating}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={
                actionType === "delete" ? handleDeleteRole : handleUpdateRole
              }
              disabled={isDeleting || isUpdating}
            >
              {actionType === "delete" ? "Delete" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

TableUserRole.propTypes = {
  type: PropTypes.string,
  setType: PropTypes.func,
};

export default TableUserRole;
