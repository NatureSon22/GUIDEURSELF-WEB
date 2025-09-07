import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProgramNameData } from "@/api/component-info";
import { useToast } from "@/hooks/use-toast";
import AddProgramNameModal from "./AddProgramNameModal";
import EditProgramNameModal from "./EditProgramNameModal";
import { BiSolidEdit } from "react-icons/bi";
import { GrNext, GrPrevious } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import formatDateTime from "@/utils/formatDateTime";
import useToggleTheme from "@/context/useToggleTheme"; 

const ProgramNameField = () => {
  const queryClient = useQueryClient();
  const { isDarkMode } = useToggleTheme((state) => state);
  const { toast } = useToast();
  const { data: programs, isLoading, isError } = useQuery({
    queryKey: ["programnames"],
    queryFn: getProgramNameData,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredPrograms = programs
  ? programs.filter((program) =>
      (program?.programtype || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
    <div className={` box-shadow-100 border border-secondary-200/40 space-y-4 rounded-lg p-4`}>
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className={`text-[0.95rem] font-semibold ${
              isDarkMode ? "text-dark text-dark-text-base-300" : ""
            }`}>Program Name</p>
          <p className={`text-[0.85rem] ${
              isDarkMode
                ? "text-dark-text-base-300-75"
                : "text-secondary-100/60"
            }`}>
            Create program name for university
          </p>
        </div>
        <div className="w-[100%] flex flex-row gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}

          />
          <Button
            variant="outline"
            
        className={`ml-auto ${isDarkMode ? "border-dark-text-base-300-75/60 bg-dark-secondary-200 text-dark-text-base-300" : "text-secondary-100-75"} `}
            onClick={openModal}
          >
            Add Program Name
          </Button>
        </div>

        <div className="mt-4 h-[320px] flex flex-col justify-between overflow-y-auto">
          {isLoading ? (
            <p>Loading program type...</p>
          ) : isError ? (
            <p>Error fetching program type.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Program Type</th>
                  <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Program Name</th>
                  <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Date Added</th>
                  <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.length > 0 ? (
                  paginatedPrograms.map((program) => (
                    <tr key={program._id}>
                      <td className={`${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-[0.9rem]`}>{program.programtype}</td>
                      <td className={`${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-center text-[0.9rem]`}>
                        {program.programname}
                      </td>
                      <td className={`${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-center text-[0.9rem]`}>
                        {formatDateTime(program.date_added)}
                      </td>
                      <td className="flex items-center justify-center gap-5 p-2">
                        <Button
                          variant="secondary"
                        className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
                          onClick={() => handleOpenEditModal(program)}
                        >
                          <BiSolidEdit />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="group rounded-full bg-accent-100/10 px-[0.65rem]"
                          onClick={() => handleDeleteProgram(program._id)}
                        >
                          <MdDelete className="text-accent-100 group-hover:text-white" />
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
          {filteredPrograms.length > 0 && (
                    <div className="mb-0 mt-auto flex items-center justify-between pt-7">
                      <p className={`text-[0.9rem] font-semibold text-secondary-100-75 ${
                        isDarkMode ? "text-white" : "text-dark text-dark-text-base-300"
                      }`}>
                      {`Showing ${currentPage} of ${totalPages} ${
                        totalPages > 1 ? "pages" : "page"
                      }`}
                    </p>
          
                      <div className="flex items-center gap-2">
                      <Button variant="outline" className="font-semibold text-secondary-100-75" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                      <GrPrevious />
                       Prev
                      </Button>
                       <Input
                          type="number"
                          min="1"
                          value={currentPage}
                          className="w-16 rounded border p-1 text-center"
                        />
                      <Button variant="outline" className="font-semibold text-secondary-100-75"onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                        <GrNext />
                      </Button>
                    </div>
                    </div>
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