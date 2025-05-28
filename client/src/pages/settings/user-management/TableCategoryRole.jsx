import { getAllRolesWithCategories, updateCategoryRole } from "@/api/role";
import DataTable from "@/components/DataTable";
import CategoryRoleColumns from "@/components/columns/CategoryRole";
import Loading from "@/components/Loading";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const dialog_type = {
  view: "view",
  edit: "edit",
  delete: "delete",
};

const TableCategoryRole = ({ type, setType }) => {
  const {
    data: roles,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["roleTypesWithCategories"],
    queryFn: getAllRolesWithCategories,
  });
  const { toast } = useToast();
  const [filters, setFilters] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dialogType, setDialogType] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [hasEmptyCategory, setHasEmptyCategory] = useState(false);
  const [hasNoSelected, setHasNoSelected] = useState(true);
  const { mutate: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: updateCategoryRole,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category role updated successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update category role",
      });
    },
    onSettled: () => {
      setOpenDialog(false);
    },
  });

  const handleUpdateCategory = () => {
    const form = new FormData();
    form.append("role_id", roleId);
    categories.forEach((category) =>
      form.append("categories[]", JSON.stringify(category)),
    );

    updateRole(form);
  };

  const handleOpenDialog = (type, role) => {
    const rolesWithDefaultDeleteStatus = role.categories.map((item) => ({
      ...item,
      isDeleted: false,
      isUpdated: false,
    }));
    setDialogType(type);
    setRoleId(role._id);
    setCategories(rolesWithDefaultDeleteStatus);
    setOpenDialog(true);
  };

  const handleChangeCategoryName = (categoryId, newName) => {
    setCategories((prev) => {
      const updatedCategories = prev.map((category) =>
        category._id === categoryId
          ? { ...category, name: newName, isUpdated: true }
          : category,
      );
      const hasEmpty = updatedCategories.some(
        (category) => category.name.trim().length == 0,
      );
      setHasEmptyCategory(hasEmpty);

      return updatedCategories;
    });
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories((prev) => {
      const updatedCategories = prev.map((category) =>
        category._id === categoryId
          ? { ...category, isDeleted: !category.isDeleted }
          : category,
      );

      const hasDeleted = updatedCategories.some(
        (category) => category.isDeleted,
      );

      setHasNoSelected(!hasDeleted);

      return updatedCategories;
    });
  };

  return isLoading ? (
    <div className="py-40">
      <Loading />
    </div>
  ) : (
    <>
      <DataTable
        data={roles}
        columns={CategoryRoleColumns}
        filters={filters}
        setFilters={setFilters}
        globalFilter={type}
        setGlobalFilter={setType}
        columnActions={{ dialog_type, handleOpenDialog }}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="grid gap-5 sm:max-w-[400px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>
              {dialogType === dialog_type.view
                ? "Category Role Details" // More specific and professional than "Category roles"
                : dialogType === dialog_type.edit
                  ? "Edit Role Category"
                  : dialogType === dialog_type.delete // Added delete case
                    ? "Delete Role Category"
                    : "Role Category"}{" "}
              {/* Default/fallback title */}
            </DialogTitle>
            <DialogDescription>
              {dialogType === dialog_type.view
                ? "Review the details of this role category." // Clear instruction for viewing
                : dialogType === dialog_type.edit
                  ? "Update the information for this role category." // Clear instruction and reminder
                  : dialogType === dialog_type.delete
                    ? "Delete the information for this role category" // Strong warning and confirmation
                    : "Manage role categories and their assigned user types."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            {dialogType === dialog_type.view ? (
              categories.length == 0 ? (
                <></>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="rounded-sm bg-secondary-200-50/60 px-8 py-3 text-[0.9rem] font-medium uppercase text-secondary-100-75"
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              )
            ) : dialogType === dialog_type.edit ? (
              <div className="mb-2 space-y-3">
                {categories.map((category) => (
                  <Input
                    key={category._id}
                    value={category.name}
                    onChange={(e) =>
                      handleChangeCategoryName(category._id, e.target.value)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="mb-2 space-y-3">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="ml-3 flex items-center gap-4"
                  >
                    <Checkbox
                      checked={category.isDeleted}
                      className="border-secondary-100-75/50"
                      onCheckedChange={() => handleDeleteCategory(category._id)}
                    />
                    <p
                      className={
                        category.isDeleted
                          ? "text-secondary-100-75 line-through"
                          : ""
                      }
                    >
                      {category.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {dialogType !== dialog_type.view && (
            <DialogFooter className="ml-auto mt-2">
              <Button
                variant="ghost"
                className="text-base-200"
                onClick={() => setOpenDialog(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                className="bg-base-200"
                onClick={handleUpdateCategory}
                disabled={
                  isUpdating ||
                  hasEmptyCategory ||
                  dialogType === dialog_type.delete && !isUpdating
                    ? hasNoSelected
                    : false
                }
              >
                {dialogType !== dialog_type.delete ? "Save" : "Delete"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableCategoryRole;
