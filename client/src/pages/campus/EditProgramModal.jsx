import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import CloseIcon from "../../assets/CloseIcon.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const EditProgramModal = ({ isOpen, onClose, program, onSave, programtype }) => {
  const [programNames, setProgramNames] = useState([]); // All program names
  const [currentProgram, setCurrentProgram] = useState(program.program_name);
  const [selectedProgram, setSelectedProgram] = useState(""); // Selected program name
  const [majorNames, setMajorNames] = useState([]); // Majors for the selected program
  const [selectedMajor, setSelectedMajor] = useState(""); // Selected major
  const [majors, setMajors] = useState([]); // List of added majors
  const { toast } = useToast();
  

  // Initialize form data when the modal opens or the program prop changes
  useEffect(() => {
    if (program) {
      setSelectedProgram(program.program_name || ""); // Set the current program name
      setMajors(program.majors || []); // Set the current majors
    }
  }, [program]);

  // Fetch program names based on the program type when the modal opens or program type changes
  useEffect(() => {
    const fetchProgramNames = async () => {
      try {
        if (!programtype) return; // Do not fetch if program type is not set

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/campusprogramnames?programtype=${programtype}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch program names");
        const data = await response.json();

        // Remove duplicate program names
        const uniqueProgramNames = Array.from(new Set(data.map((program) => program.programname)))
          .map((programname) => data.find((program) => program.programname === programname));

        setProgramNames(uniqueProgramNames);
      } catch (error) {
        console.error("Error fetching program names:", error);
      }
    };

    if (isOpen) fetchProgramNames();
  }, [isOpen, programtype]); // Fetch when modal opens or program type changes

  // Fetch majors based on the selected program name
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        if (!selectedProgram) return; // Do not fetch if no program is selected

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/campusmajors?programname=${selectedProgram}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch majors");
        const data = await response.json();

        // Remove duplicate majors
        const uniqueMajors = Array.from(new Set(data.map((major) => major.majorname)))
          .map((majorname) => data.find((major) => major.majorname === majorname));

        setMajorNames(uniqueMajors);
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    if (isOpen && selectedProgram) fetchMajors();
  }, [isOpen, selectedProgram]); // Fetch when modal opens or selected program changes

  // Handle adding a major
  const handleAddMajor = () => {
    if (selectedMajor.trim() === "") return; // Do not add empty majors

    // Check if the major already exists in the list
    if (majors.includes(selectedMajor)) {
        toast({
            title: "Adding Major Failed",
            description: "Major already exist!",
            variant: "destructive",
        });
      return;
    }

    setMajors([...majors, selectedMajor]);
    setSelectedMajor(""); // Clear the selected major
  };

  // Handle removing a major
  const handleRemoveMajor = (index) => {
    const updatedMajors = majors.filter((_, i) => i !== index);
    setMajors(updatedMajors);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProgram = {
      program_name: currentProgram,
      majors,
    };

    onSave(updatedProgram); // Pass the updated program data back to the parent
    onClose(); // Close the modal
  };

  // Handle cancel button click
  const handleCancel = () => {
    onClose(); // Close the modal
  };

  if (!isOpen || !program) return null; // Only render if the modal is open and program data is available

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc] z-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <div className="flex flex-col gap-4">
          {/* Program Type (Non-editable) */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Program Type</Label>
            <Input
              value={programtype}
              disabled
              className="w-full h-10 border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Program Name (Editable dropdown) */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Program Name</Label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md p-2"
            >
              <option value="" disabled hidden>
                Select Program Name
              </option>
              {programNames.map((program) => (
                <option key={program._id} value={program.programname}>
                  {program.programname}
                </option>
              ))}
            </select>
          </div>

          {/* Major Name Select */}
          <div className="flex flex-col border border-gray-300 rounded-md p-4">
            <div className="flex gap-4">
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md p-2"
                disabled={!selectedProgram || majorNames.length === 0}
                >
              <option value="" hidden>
                {majorNames.length === 0 ? "NO MAJORS AVAILABLE" : "SELECT MAJOR NAME"}
              </option>
                {majorNames.map((major) => (
                  <option key={major._id} value={major.majorname}>
                    {major.majorname}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                className="!w-[25%] border border-base-200 bg-base-200 text-white w-[100px] p-2 rounded-md hover:bg-base-200"
                onClick={handleAddMajor}
                disabled={!selectedMajor} 
               >
                <FaPlus />
                Add Major
              </Button>
            </div>

            <Label className="mb-2 mt-6">Major in:</Label>

            <div className="flex flex-col gap-2">
              {majors.map((major, index) => (
                <div key={index} className="flex justify-between items-center py-1 px-1 border rounded-md">
                  <span>{major}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMajor(index)}
                    className="text-red-500 hover:underline"
                  >
                    <img src={CloseIcon} className="w-[20px] h-[20px]" alt="" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="text-base-200 bg-white shadow-none hover:bg-secondary-350 w-[100px] p-2 border-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="border border-base-200 bg-base-200 text-white w-[100px] p-2 rounded-md hover:bg-base-200"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProgramModal;