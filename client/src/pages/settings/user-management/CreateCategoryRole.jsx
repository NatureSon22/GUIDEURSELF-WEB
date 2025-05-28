import { getAllRoleTypes } from "@/api/component-info";
import { addCategoryRole, getCategoryRoles } from "@/api/role";
import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RiAddLargeFill } from "react-icons/ri";

const CreateCategoryRole = () => {
  const client = useQueryClient();
  const { toast } = useToast();
  const [open, setOpenDialog] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [category, setCategory] = useState("");
  const { data: roles } = useQuery({
    queryKey: ["roletypes"],
    queryFn: getAllRoleTypes,
  });
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", roleId],
    queryFn: () => getCategoryRoles(roleId),
    enabled: !!roleId,
  });
  const { mutate: handleAddCategoryRole, isPending } = useMutation({
    mutationFn: (data) => addCategoryRole(data),
    onSuccess: () => {
      setCategory("");

      setRoleId("");
      client.invalidateQueries(["roleTypesWithCategories"]);
      toast({
        title: "Success",
        description: "Category role added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add category role",
      });
    },
    onSettled: () => {
      setOpenDialog(false);
    },
  });

  const handleCreateCategoryRole = () => {
    const form = new FormData();
    form.append("role_id", roleId);
    form.append("categoryName", category);

    handleAddCategoryRole(form);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setCategory("");
    setOpenDialog(false);
    setRoleId("");
  };

  return (
    <>
      <Button
        variant="outline"
        className="text-secondary-100-75"
        onClick={() => setOpenDialog(true)}
      >
        <RiAddLargeFill />
        Add Category
      </Button>

      <Dialog open={open} onOpenChange={setOpenDialog}>
        <DialogContent className="grid gap-5 sm:max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>New Role Category</DialogTitle>
            <DialogDescription>
              Create a new category for the selected user type
            </DialogDescription>
          </DialogHeader>

          <div>
            <ComboBox
              options={roles}
              placeholder="Select user type"
              onChange={setRoleId}
              value={roleId}
            />
          </div>

          <div className="mb-3 mt-2 space-y-5">
            <Input
              value={category}
              placeholder="Enter a new role category"
              onChange={(e) => setCategory(e.target.value)}
            />

            {roleId &&
              (categoriesLoading ? (
                <div>
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : categories.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((category) => {
                    return (
                      <div
                        key={category}
                        className="rounded-sm bg-secondary-200-50/60 px-8 py-4 font-medium uppercase text-secondary-100-75"
                      >
                        <p>{category}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-secondary-200/30 py-5 text-center text-[0.9rem] text-secondary-100-75/50">
                  <div>No categories found for the selected user type</div>
                </div>
              ))}
          </div>

          <DialogFooter className="ml-auto">
            <Button
              variant="ghost"
              className="text-base-200"
              disabled={isPending}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-base-200"
              onClick={handleCreateCategoryRole}
              disabled={isPending || !category || !roleId}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateCategoryRole;
