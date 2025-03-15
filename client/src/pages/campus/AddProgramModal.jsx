import { useState, useEffect } from "react";
import addImage from "../../assets/add.png";
import CloseIcon from "../../assets/CloseIcon.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddProgramModal = ({ isOpen, onClose, onAddProgram }) => {
  const [programTypes, setProgramTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [programNames, setProgramNames] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [majorNames, setMajorNames] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");

  const [programName, setProgramName] = useState("");
  const [majors, setMajors] = useState([]);
  const [newMajor, setNewMajor] = useState("");

  // Fetch program types when the modal opens
  useEffect(() => {
    const fetchProgramTypes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/campusprogramtypes`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch program types");
        const data = await response.json();
        setProgramTypes(data);
      } catch (error) {
        console.error("Error fetching program types:", error);
      }
    };

    if (isOpen) fetchProgramTypes();
  }, [isOpen]);

  // Fetch program names based on selected program type
  useEffect(() => {
    const fetchProgramNames = async () => {
      try {
        if (!selectedType) return;
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/campusprogramnames?programtype=${selectedType}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Failed to fetch program names");
        const data = await response.json();
        setProgramNames(data);
        setSelectedProgram(""); // Reset program selection
        setMajors([]); // Clear added majors when program type changes
      } catch (error) {
        console.error("Error fetching program names:", error);
      }
    };

    fetchProgramNames();
  }, [selectedType]);

  // Fetch majors based on selected program name
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        if (!selectedProgram) return;
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/campusmajors?programname=${selectedProgram}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Failed to fetch majors");
        const data = await response.json();
        setMajorNames(data);
        setSelectedMajor(""); // Reset major selection
        setMajors([]); // Clear added majors when program name changes
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors();
  }, [selectedProgram]);

  // Reset all form data
  const resetForm = () => {
    setSelectedType("");
    setSelectedProgram("");
    setSelectedMajor("");
    setMajors([]);
    setProgramNames([]);
    setMajorNames([]);
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm(); // Reset all form data
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  const handleAddMajor = () => {
    if (selectedMajor.trim() !== "") {
      setMajors([...majors, selectedMajor]);
      setSelectedMajor(""); // Clear the selected major
    }
  };

  const handleRemoveMajor = (index) => {
    const updatedMajors = majors.filter((_, i) => i !== index);
    setMajors(updatedMajors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProgram = {
      program_name: selectedProgram,
      majors,
    };

    const formattedProgram = {
      program_type_id: selectedType,
      programs: [newProgram],
    };

    onAddProgram(formattedProgram); // Send structured data back to parent
    resetForm(); // Reset all form data after submission
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc] z-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <div className="flex flex-col gap-4">
          {/* Program Type Select */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Program Type</Label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md p-2"
            >
              <option value="">SELECT PROGRAM TYPE</option>
              {programTypes.map((type) => (
                <option key={type._id} value={type.program_type_name}>
                  {type.program_type_name}
                </option>
              ))}
            </select>
          </div>

          {/* Program Name Select */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Program Name</Label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md p-2"
              disabled={!selectedType} // Disable if no program type is selected
            >
              <option value="">SELECT PROGRAM NAME</option>
              {programNames.map((program) => (
                <option key={program._id} value={program.programname}>
                  {program.programname}
                </option>
              ))}
            </select>
          </div>

          {/* Major Name Select */}
          <div className="flex flex-col border border-gray-300 rounded-md p-4">
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md p-2"
              disabled={!selectedProgram} // Disable if no program name is selected
            >
              <option value="">SELECT MAJOR NAME</option>
              {majorNames.map((major) => (
                <option key={major._id} value={major.majorname}>
                  {major.majorname}
                </option>
              ))}
            </select>

            <div className="flex justify-end">
              <button
                type="button"
                className="w-[40%] text-md h-10 flex mt-5 justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300"
                onClick={handleAddMajor}
              >
                <img className="w-[30px] h-[30px]" src={addImage} alt="Add Major" />
                Add Major
              </button>
            </div>

            <Label className="mb-2 mt-2">Major in:</Label>

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
              onClick={handleCancel} // Use handleCancel instead of onClose
              className="text-base-200 bg-white shadow-none hover:bg-secondary-350 w-[100px] p-2 border-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="border border-base-200 bg-base-200 text-white w-[100px] p-2 rounded-md hover:bg-base-200"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProgramModal;