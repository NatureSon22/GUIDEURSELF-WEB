import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const AddPositionModal = ({ onClose, queryClient, addPosition }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [newPosition, setNewPosition] = useState("");

  const handleAddPosition = async () => {
    if (!newPosition.trim()) return;

    try {
      const response = await addPosition(newPosition);
      queryClient.setQueryData(["universitypositions"], (oldData) => [
        ...(oldData || []),
        response,
      ]);

      toast({
        title: "Success",
        description: "New position successfully added",
      });
      onClose();
      setNewPosition("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="grid gap-5 sm:max-w-[525px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Add Administrative Position</DialogTitle>
          <DialogDescription>
            Create a new administrative position.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          placeholder="Enter program type"
        />

        <DialogFooter className="ml-auto mt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAddPosition} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPositionModal;
