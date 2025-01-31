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
import { updatePosition } from "@/api/university-settings";

const EditPositionModal = ({ open, onClose, position }) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUpdatePosition = async () => {
    const updatedName = inputRef.current?.value.trim();
    if (!updatedName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Position name cannot be empty.",
      });
      return;
    }

    setLoading(true);

    try {
      await updatePosition(position._id, updatedName);
      queryClient.invalidateQueries(["universitypositions"]);
      toast({
        title: "Success",
        description: "Position updated successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update position.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="grid gap-5 sm:max-w-[525px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Edit Position</DialogTitle>
          <DialogDescription>
            Update the name of the administrative position.
          </DialogDescription>
        </DialogHeader>

        <Input
          id="position"
          ref={inputRef}
          defaultValue={position?.position_name}
          placeholder="Enter position name"
          aria-label="Position Name"
        />

        <DialogFooter className="ml-auto mt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdatePosition} disabled={loading}>
            {loading ? "Updating..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPositionModal;
