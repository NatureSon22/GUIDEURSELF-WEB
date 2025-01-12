import { useState, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { updateType } from "@/api/university-settings";

const EditTypeModal = ({ open, onClose, type }) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUpdateType = async () => {
    const updatedType = inputRef.current?.value.trim();
    if (!updatedType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Program type name cannot be empty.",
      });
      return;
    }

    setLoading(true);

    try {
      await updateType(type._id, updatedType);
      queryClient.invalidateQueries(["programtypes"]);
      toast({
        title: "Success",
        description: "Program type updated successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update program type.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="grid gap-5 sm:max-w-[525px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Edit Program Type</DialogTitle>
          <DialogDescription>
            Update the type name of the program type name.
          </DialogDescription>
        </DialogHeader>

        <Input
          id="type"
          ref={inputRef}
          defaultValue={type?.program_type_name}
          placeholder="Enter program type name"
          aria-label="Program Type Name"
        />

        <DialogFooter className="ml-auto mt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdateType} disabled={loading}>
            {loading ? "Updating..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTypeModal;
