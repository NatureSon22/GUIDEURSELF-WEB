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

const AddMajorModal = ({ onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [programNames, setProgramNames] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState("");
    const [majorName, setMajorName] = useState("");
  
    useEffect(() => {
      const fetchProgramName = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/campusprogramnames`, {
            credentials: "include",
          });
          if (!response.ok) throw new Error("Failed to fetch program names");
          const data = await response.json();
          setProgramNames(data);
        } catch (error) {
          console.error("Error fetching program types:", error);
        }
      };
      
      fetchProgramName();
    }, []);
  
    // Function to add program to the backend
    const addMajor = async (majorData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/campusmajors`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(majorData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add major");
      }
  
      return await response.json();
    };
  
    const handleAddMajor = async () => {
      if (!selectedProgram || !majorName.trim()) {
        toast({
          title: "Error",
          description: "Please select a program name and enter a major name.",
          type: "destructive",
        });
        return;
      }
    
      setLoading(true);
    
      try {
        const newMajor = {
          programname: selectedProgram,
          majorname: majorName,
        };
    
        const response = await addMajor(newMajor);
  
        // Invalidate the programnames query to refetch the data
        queryClient.invalidateQueries(["majornames"]);
  
        toast({
          title: "Success",
          description: "New major successfully added",
        });
    
        setMajorName(""); // Clear the input field
        onClose(); // Close the modal
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
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="grid gap-5 sm:max-w-[525px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Add Major</DialogTitle>
            <DialogDescription>
              Create a new program name.
            </DialogDescription>
          </DialogHeader>
  
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full h-10 outline-none border border-gray-300 rounded-md p-2"
          >
            <option value="">SELECT PROGRAM NAME</option>
            {programNames.map((program) => (
              <option key={program._id} value={program.programname}>
                {program.programname}
              </option>
            ))}
          </select>
  
          <Input
            value={majorName}
            onChange={(e) => setMajorName(e.target.value)}
            placeholder="Enter major name"
          />
  
          <DialogFooter className="ml-auto mt-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAddMajor} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

export default AddMajorModal;
