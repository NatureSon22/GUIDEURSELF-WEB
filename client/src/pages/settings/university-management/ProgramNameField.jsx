import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProgramNameData } from "@/api/component-info";
import { useToast } from "@/hooks/use-toast";
import AddProgramNameModal from "./AddProgramNameModal";
import EditProgramNameModal from "./EditProgramNameModal";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import formatDateTime from "@/utils/formatDateTime";

const ProgramNameField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: programs, isLoading, isError } = useQuery({
    queryKey: ["programnames"],
    queryFn: getProgramNameData,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Filter programs based on search term
  const filteredPrograms = programs
  ? programs.filter(
      (program) =>
        program.programname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.programtype.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  const handleDeleteProgram = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/campusprogramnames/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete type");
      }

      queryClient.invalidateQueries(["programnames"]);

      toast({
        title: "Success",
        description: "Program name deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
      });
    }
  };

  const handleOpenEditModal = (program) => {
    console.log("Selected Program Name:", program); // Log the position
    setSelectedProgram(program);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProgram(null);
  };

  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="box-shadow-100 space-y-4 rounded-lg bg-white p-4">
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className="text-[0.95rem] font-semibold">Program Name</p>
          <p className="text-[0.85rem] text-secondary-100/60">
            Create program name for university
          </p>
        </div>
        <div className="w-[100%] flex flex-row gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
          <Button
            variant="outline"
            className="text-secondary-100-75"
            onClick={openModal}
          >
            Add Program Name
          </Button>
        </div>

        <div className="mt-4 h-[300px] overflow-y-auto">
          {isLoading ? (
            <p>Loading program type...</p>
          ) : isError ? (
            <p>Error fetching program type.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-center text-[0.9rem]">Program Type</th>
                  <th className="p-2 border text-center text-[0.9rem]">Program Name</th>
                  <th className="p-2 border text-center text-[0.9rem]">Date Added</th>
                  <th className="p-2 border text-center text-[0.9rem]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program) => (
                    <tr key={program._id}>
                      <td className="p-2 border text-[0.9rem]">{program.programtype}</td>
                      <td className="p-2 border text-center text-[0.9rem]">
                        {program.programname}
                      </td>
                      <td className="p-2 border text-center text-[0.9rem]">
                        {formatDateTime(program.date_added)}
                      </td>
                      <td className="p-2 border text-[0.9rem] flex gap-2">
                        <Button
                          variant="secondary"
                          className="bg-base-200/10 w-full text-base-200"
                          onClick={() => handleOpenEditModal(program)}
                        >
                          <BiSolidEdit />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="p-1 bg-red-500 w-full text-white rounded-md"
                          onClick={() => handleDeleteProgram(program._id)}
                        >
                          <MdDelete />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border" colSpan="4">
                      No matching program name found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <EditProgramNameModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        program={selectedProgram}
      />
      {isModalOpen && (
        <AddProgramNameModal onClose={closeModal} queryClient={queryClient} />
      )}
    </div>
  );
};

export default ProgramNameField;