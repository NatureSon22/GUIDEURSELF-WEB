import { useState, useEffect } from "react";
import addImage from "../../assets/add.png";
import CloseIcon from "../../assets/CloseIcon.png";

const AddProgramModal = ({ isOpen, onClose, onAddProgram }) => {
  const [programTypes, setProgramTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [programName, setProgramName] = useState("");
  const [majors, setMajors] = useState([]);
  const [newMajor, setNewMajor] = useState("");

  // Fetch program types when modal opens
  useEffect(() => {
    const fetchProgramTypes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/campusprogramtypes", {credentials: "include" });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProgramTypes(data);
      } catch (error) {
        console.error("Error fetching program types:", error);
      }
    };

    if (isOpen) {
      fetchProgramTypes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddMajor = () => {
    if (newMajor.trim() !== "") {
      setMajors([...majors, newMajor]);
      setNewMajor(""); // Clear input
    }
  };

  const handleRemoveMajor = (index) => {
    const updatedMajors = majors.filter((_, i) => i !== index);
    setMajors(updatedMajors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProgram = {
      program_name: programName,
      majors,
    };
  
    const formattedProgram = {
      program_type_id: selectedType,
      programs: [newProgram],
    };
  
    onAddProgram(formattedProgram);  // Send structured data back to parent
    setSelectedType("");  
    setProgramName("");
    setMajors([]);
    onClose();  
  };
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc] z-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-medium">Program Type</h3>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md p-2"
            >
              <option value="">SELECT PROGRAM TYPE</option>
              {programTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.program_type_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-lg font-medium">Program Name</h3>
            <input
              placeholder="Enter the name of the new program"
              className="w-full h-10 pl-2 pr-2 outline-none border border-gray-300 rounded-md"
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="w-[40%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300"
              onClick={handleAddMajor}
            >
              <img className="w-[30px] h-[30px]" src={addImage} alt="Add Major" />
              Add Major
            </button>
          </div>

          <div className="border border-gray-300 rounded-md p-4">
            <input
              placeholder="Enter major"
              className="w-full h-10 pl-2 pr-2 outline-none border border-gray-300 rounded-md"
              type="text"
              value={newMajor}
              onChange={(e) => setNewMajor(e.target.value)}
            />
            <p className="mb-2 mt-2">Major in:</p>
            
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

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-blue-500 border-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white h-10 px-4 rounded-md"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProgramModal;