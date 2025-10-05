import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProgramTypeData } from "@/api/component-info";
import { addType } from "@/api/university-settings";
import { useToast } from "@/hooks/use-toast";
import EditTypeModal from "./EditTypeModal";
import { GrNext, GrPrevious } from "react-icons/gr";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import formatDateTime from "@/utils/formatDateTime";
import AddProgramTypeModal from "./AddProgramTypeModal";
import useToggleTheme from "@/context/useToggleTheme"; 

const ProgramTypeField = () => {
  const queryClient = useQueryClient();
  const { isDarkMode } = useToggleTheme((state) => state);
  const { toast } = useToast();
  const { data: types, isLoading, isError } = useQuery({
    queryKey: ["programtypes"],
    queryFn: getProgramTypeData,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredTypes = types
  ? types.filter((type) =>
      (type?.program_type_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  const totalPages = Math.ceil(filteredTypes.length / itemsPerPage);
  const paginatedTypes = filteredTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteType = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/campusprogramtypes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete type");
      }

      queryClient.invalidateQueries(["programtypes"]);

      toast({
        title: "Success",
        description: "Program type deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
      });
    }
  };

  const handleOpenEditModal = (type) => {
    console.log("Selected Program Type:", type); // Log the position
    setSelectedType(type);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedType(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`${isDarkMode ? ' ' : 'bg-white'} box-shadow-100 space-y-4 border border-secondary-200/40 rounded-lg p-4`}>
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className={`text-[0.95rem] font-semibold ${
              isDarkMode ? "text-dark text-dark-text-base-300" : ""
            }`}>Program Type</p>
          <p className={`text-[0.85rem] ${
              isDarkMode
                ? "text-dark-text-base-300-75"
                : "text-secondary-100/60"
            }`}>
            Define program type for university
          </p>
        </div>
        <div className="w-[100%] flex flex-row gap-2">
          <Input
            type="text"
            placeholder="Search"
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
            Add Program Type
          </Button>
        </div>

        <div className="mt-4 flex flex-col justify-between overflow-y-auto">
          {isLoading ? (
            <p>Loading program type...</p>
          ) : isError ? (
            <p>Error fetching program type.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead className={` ${isDarkMode ? "bg-dark-secondary-200" : "bg-secondary-400"} `}>
                <tr className="bg-gray-100">
                  <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Program Type</th>
                  <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Date Added</th>
                  <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTypes.length > 0 ? (
                  paginatedTypes.map((type) => (
                    <tr key={type._id}>
                      <td className={` ${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-[0.9rem] w-[702px]`}>
                        {type.program_type_name}
                      </td>
                      <td className={`${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-center text-[0.9rem]`}>
                        {formatDateTime(type.date_added)}
                      </td>
                      <td className={` ${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} flex items-center justify-center gap-5 p-2`}>
                        <Button
                          variant="secondary"
                        className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
                          onClick={() => handleOpenEditModal(type)}
                        >
                          <BiSolidEdit />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="group rounded-full bg-accent-100/10 px-[0.65rem]"
                          onClick={() => handleDeleteType(type._id)}
                        >
                          <MdDelete className="text-accent-100 group-hover:text-white" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border" colSpan="3">
                      No program types available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {filteredTypes.length > 0 && (
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

      <EditTypeModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        type={selectedType}
      />

      {isModalOpen && (
        <AddProgramTypeModal onClose={closeModal} queryClient={queryClient} addType={addType} />
      )}
    </div>
  );
};

export default ProgramTypeField;