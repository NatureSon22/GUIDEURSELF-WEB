import React, { useState, useEffect } from 'react';
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

const AddProgramTypeModal = ({ onClose, queryClient, addType }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [newType, setNewType] = useState("");
    
  const handleAddType = async () => {
    if (!newType.trim()) return;

    try {
      const response = await addType(newType);
      queryClient.setQueryData(["programtypes"], (oldData) => [
        ...(oldData || []),
        response,
      ]);

      toast({
        title: "Success",
        description: "New program type successfully added",
      });
      onClose();
      setNewType("");
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
            <DialogTitle>Add Program Type</DialogTitle>
            <DialogDescription>
              Create the type of the program.
            </DialogDescription>
          </DialogHeader>
  
          <Input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Enter program type"
          />
  
          <DialogFooter className="ml-auto mt-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAddType} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

export default AddProgramTypeModal;
