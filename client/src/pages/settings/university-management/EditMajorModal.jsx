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

const EditMajorModal = ({ open, onClose, major }) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [programNames, setProgramNames] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  // Fetch program types when the modal is opened
  useEffect(() => {
    const fetchProgramNames = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/campusprogramnames`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch program names");
        const data = await response.json();
        setProgramNames(data);
      } catch (error) {
        console.error("Error fetching program names:", error);
      }
    };

    fetchProgramNames();
  }, []);

  // Set the initial selected type when the modal opens or the program changes
  useEffect(() => {
    if (major) {
      setSelectedName(major.programname || "");
    }
  }, [major]);

  const handleUpdateMajor = async () => {
    // Validate inputs
    if (!selectedName || !inputRef.current.value.trim()) {
      toast({
        title: "Error",
        description: "Please select a program name and enter a major name.",
        type: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare the updated data
      const updatedMajor = {
        programname: selectedName,
        majorname: inputRef.current.value.trim(),
      };

      // Make the API call to update the program
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/campusmajors/${major._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMajor),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update major");
      }

      // Show success toast
      toast({
        title: "Success",
        description: "Major updated successfully.",
      });

      // Invalidate the query to refetch updated data
      queryClient.invalidateQueries(["majornames"]);

      // Close the modal
      onClose();
    } catch (error) {
      // Show error toast
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
          <DialogTitle>Edit Major Name</DialogTitle>
          <DialogDescription>
            Update the name of the selected major.
          </DialogDescription>
        </DialogHeader>

        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="w-full h-10 outline-none border border-gray-300 rounded-md p-2"
        >
          <option value="">SELECT PROGRAM TYPE</option>
          {programNames.map((program) => (
            <option key={program._id} value={program.programname}>
              {program.programname}
            </option>
          ))}
        </select>

        <Input
          id="type"
          ref={inputRef}
          defaultValue={major?.majorname}
          placeholder="Enter major name"
          aria-label="Major Name"
        />

        <DialogFooter className="ml-auto mt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdateMajor} disabled={loading}>
            {loading ? "Updating..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMajorModal;
