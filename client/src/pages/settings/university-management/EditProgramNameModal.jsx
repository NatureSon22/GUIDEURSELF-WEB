import { useState, useRef, useEffect } from "react";
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

const EditProgramNameModal = ({ open, onClose, program }) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [programTypes, setProgramTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  // Function to fetch program types
  const fetchProgramTypes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/campusprogramtypes", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch program types");
      const data = await response.json();
      setProgramTypes(data);
    } catch (error) {
      console.error("Error fetching program types:", error);
    }
  };

  // Fetch program types whenever the modal opens
  useEffect(() => {
    if (open) {
      fetchProgramTypes();
    }
  }, [open]);

  // Set the initial selected type when the modal opens or the program changes
  useEffect(() => {
    if (program) {
      setSelectedType(program.programtype || "");
    }
  }, [program]);

  const handleUpdateType = async () => {
    if (!selectedType || !inputRef.current.value.trim()) {
      toast({
        title: "Error",
        description: "Please select a program type and enter a program name.",
        type: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const updatedProgram = {
        programtype: selectedType,
        programname: inputRef.current.value.trim(),
      };

      const response = await fetch(
        `http://localhost:3000/api/campusprogramnames/${program._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProgram),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update program");
      }

      toast({
        title: "Success",
        description: "Program updated successfully.",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(["programnames"]);
      queryClient.invalidateQueries(["programTypes"]); // Ensure dropdown updates

      onClose(); // Close modal
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
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

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full h-10 outline-none border border-gray-300 rounded-md p-2"
        >
          <option value="">SELECT PROGRAM TYPE</option>
          {programTypes.map((type) => (
            <option key={type._id} value={type.program_type_name}>
              {type.program_type_name}
            </option>
          ))}
        </select>

        <Input
          id="type"
          ref={inputRef}
          defaultValue={program?.programname}
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

export default EditProgramNameModal;
