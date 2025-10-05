import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMajorData } from "@/api/component-info";
import { useToast } from "@/hooks/use-toast";
import AddMajorModal from "./AddMajorModal";
import EditMajorModal from "./EditMajorModal";
import { GrNext, GrPrevious } from "react-icons/gr";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import formatDateTime from "@/utils/formatDateTime";
import useToggleTheme from "@/context/useToggleTheme"; 

const MajorField = () => {
  const queryClient = useQueryClient();
  const { isDarkMode } = useToggleTheme((state) => state);
  const { toast } = useToast();
  const { data: majors, isLoading, isError } = useQuery({
    queryKey: ["majornames"],
    queryFn: getMajorData,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredMajors = majors
  ? majors.filter((major) =>
      (major?.majorname || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  const totalPages = Math.ceil(filteredMajors.length / itemsPerPage);
  const paginatedMajors = filteredMajors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteMajor = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/campusmajors/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete major");
      }

      queryClient.invalidateQueries(["majornames"]);

      toast({
        title: "Success",
        description: "Major deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
      });
    }
  };

  const handleOpenEditModal = (major) => {
    console.log("Selected Major:", major);
    setSelectedMajor(major);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMajor(null);
  };

  const openModal = () => {
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };

  return (
    <div className={` box-shadow-100 border border-secondary-200/40 space-y-4 rounded-lg p-4`}>
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className={`text-[0.95rem] font-semibold ${
              isDarkMode ? "text-dark text-dark-text-base-300" : ""
            }`}>Major List</p>
          <p className={`text-[0.85rem] ${
              isDarkMode
                ? "text-dark-text-base-300-75"
                : "text-secondary-100/60"
            }`}>
            
            Manage and oversee the major of university
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
            Add Major
          </Button>
        </div>

        <div className="mt-4 h-[320px] flex flex-col justify-between overflow-y-auto">
          {isLoading ? (
            <p>Loading all major...</p>
          ) : isError ? (
            <p>Error fetching all major.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className={`${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Program Name</th>
                  <th className={`${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Major Name</th>
                  <th className={`${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Date Added</th>
                  <th className={`${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMajors.length > 0 ? (
                  paginatedMajors.map((major) => (
                    <tr key={major._id}>
                      <td className={`${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-[0.9rem]`}>{major.programname}</td>
                      <td className={`${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-center text-[0.9rem]`}>
                        {major.majorname}
                      </td>
                      <td className={`${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-center text-[0.9rem]`}>
                        {formatDateTime(major.date_added)}
                      </td>
                      <td className="flex items-center justify-center gap-5 p-2">
                        <Button
                          variant="secondary"
                        className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
                          onClick={() => handleOpenEditModal(major)}
                        >
                          <BiSolidEdit />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="group rounded-full bg-accent-100/10 px-[0.65rem]"
                          onClick={() => handleDeleteMajor(major._id)}
                        >
                          <MdDelete className="text-accent-100 group-hover:text-white" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border" colSpan="4">
                      No matching major found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
                    {filteredMajors.length > 0 && (
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

      <EditMajorModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        major={selectedMajor}
      />
      {isModalOpen && (
        <AddMajorModal onClose={closeModal} queryClient={queryClient} />
      )}
    </div>
  );
};

export default MajorField;