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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRole } from "@/api/role";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RiAddLargeFill } from "react-icons/ri";
import useToggleTheme from "@/context/useToggleTheme";

const CreateUserType = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef(null);
  const queryClient = useQueryClient();
  const { isDarkMode } = useToggleTheme((state) => state);

  const { mutateAsync } = useMutation({
    mutationFn: addRole,
    onSuccess: () => {
      setOpenDialog(false);
      queryClient.invalidateQueries(["roles"]);
      toast({
        title: "Success",
        description: "User type created successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create user type.",
      });
    },
  });

  const handleCreateRole = () => {
    const value = inputRef.current?.value.trim();
    if (!value) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User type cannot be empty.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("role_type", value);

    mutateAsync(formData);
  };

  return (
    <>
      <Button
        variant="outline"
        className={`ml-auto ${isDarkMode ? "border-dark-text-base-300-75/60 bg-dark-secondary-200 text-dark-text-base-300" : "text-secondary-100-75"} `}
        onClick={() => setOpenDialog(true)}
      >
        <RiAddLargeFill />
        Add User Type
      </Button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="grid gap-5 sm:max-w-[425px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>New User Type</DialogTitle>
            <DialogDescription>
              Create a new user type to assign to users.
            </DialogDescription>
          </DialogHeader>

          <Input
            id="type"
            ref={inputRef}
            placeholder="Enter user type"
            aria-label="User Type"
          />

          <DialogFooter className="ml-auto mt-2">
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreateRole}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateUserType;
