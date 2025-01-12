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

const AddProgramNameModal = ({ onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [programTypes, setProgramTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [programName, setProgramName] = useState("");
  
    useEffect(() => {
      const fetchProgramTypes = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/campusprogramtypes", {
            credentials: "include",
          });
          if (!response.ok) throw new Error("Failed to fetch program types");
          const data = await response.json();
          setProgramTypes(data);
        } catch (error) {
          console.error("Error fetching program types:", error);
        }
      };
      
      fetchProgramTypes();
    }, []);
  
    // Function to add program to the backend
    const addProgram = async (programData) => {
      const response = await fetch("http://localhost:3000/api/campusprogramnames", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add program");
      }
  
      return await response.json();
    };
  
    const handleAddProgram = async () => {
      if (!selectedType || !programName.trim()) {
        toast({
          title: "Error",
          description: "Please select a program type and enter a program name.",
          type: "destructive",
        });
        return;
      }
    
      setLoading(true);
    
      try {
        const newProgram = {
          programtype: selectedType,
          programname: programName,
        };
    
        const response = await addProgram(newProgram);
  
        // Invalidate the programnames query to refetch the data
        queryClient.invalidateQueries(["programnames"]);
  
        toast({
          title: "Success",
          description: "New program successfully added",
        });
    
        setProgramName(""); // Clear the input field
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
            <DialogTitle>Add Program Name</DialogTitle>
            <DialogDescription>
              Create the name of the program name.
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
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            placeholder="Enter program name"
          />
  
          <DialogFooter className="ml-auto mt-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAddProgram} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

export default AddProgramNameModal;
