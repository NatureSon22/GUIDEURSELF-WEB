import { useState } from "react";
import addImage from "@/assets/add.png";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPositions } from "@/api/component-info";
import { addPosition } from "@/api/university-settings";
import { useToast } from "@/hooks/use-toast";
import EditPositionModal from "./EditPositionModal";
import { BiSolidEdit } from "react-icons/bi";
import { GrNext, GrPrevious } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import Title from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddPositionModal from "./AddPositionModal";
import useToggleTheme from "@/context/useToggleTheme"; 

const AdministrativeField = () => {
  const queryClient = useQueryClient();
  const { isDarkMode } = useToggleTheme((state) => state);
  const { toast } = useToast();
  const { data: positions, isLoading, isError } = useQuery({
    queryKey: ["universitypositions"],
    queryFn: getPositions,
  });

  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredPositions = positions
    ? positions.filter((position) =>
        position.position_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

    const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);
  const paginatedPositions = filteredPositions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${day}-${month}-${year} ${hour12}:${minutes} ${ampm}`;
  };

  // Open and close modals
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle delete position
  const handleDeletePosition = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/administartiveposition/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete position");

      queryClient.invalidateQueries(["universitypositions"]);
      toast({ title: "Success", description: "Position deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: error.message, type: "destructive" });
    }
  };

  // Open edit modal
  const handleOpenEditModal = (position) => {
    setSelectedPosition(position);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPosition(null);
  };

  return (
    <div className={` box-shadow-100 border border-secondary-200/40 space-y-4 rounded-lg p-4`}>
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className={`text-[0.95rem] font-semibold ${
              isDarkMode ? "text-dark text-dark-text-base-300" : ""
            }`}>Administrative Position</p>
          <p className={`text-[0.85rem] ${
              isDarkMode
                ? "text-dark-text-base-300-75"
                : "text-secondary-100/60"
            }`}>
            Define key administrative positions
          </p>
        </div>
        <div className="w-[100%] flex flex-row gap-2">
          <Input
            type="text"
            placeholder="Search by position name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
          />
          <Button variant="outline" 
        className={`ml-auto ${isDarkMode ? "border-dark-text-base-300-75/60 bg-dark-secondary-200 text-dark-text-base-300" : "text-secondary-100-75"} `} onClick={openModal}>
            Add Position
          </Button>
        </div>

        <div className="mt-4 h-[330px] flex flex-col justify-between overflow-y-auto">
          {isLoading ? (
            <p>Loading positions...</p>
          ) : isError ? (
            <p>Error fetching positions.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className={`${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Position Name</th>
                  <th className={`${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Date Added</th>
                  <th className={`${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-center text-[0.9rem]`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.length > 0 ? (
                  paginatedPositions.map((position) => (
                    <tr key={position._id}>
                      <td className={`${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-[0.9rem] w-[702px]`}>
                        {position.position_name}
                      </td>
                      <td className={`${isDarkMode ? "border-dark-text-base-300-75/60 text-dark-text-base-300" : ""} p-2 border text-center text-[0.9rem]`}>
                        {formatDate(position.date_added)}
                      </td>
                      <td className="flex items-center justify-center border gap-5 p-2">
                        <Button
                        variant="secondary"
                        className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
                          onClick={() => handleOpenEditModal(position)}
                        >
                          <BiSolidEdit />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="group rounded-full bg-accent-100/10 px-[0.65rem]"
                          onClick={() => handleDeletePosition(position._id)}
                        >
                          <MdDelete className="text-accent-100 group-hover:text-white" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border text-center" colSpan="3">
                      No positions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {filteredPositions.length > 0 && (

            
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

      {/* Edit Position Modal */}
      <EditPositionModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        position={selectedPosition}
      />

      {/* Add Position Modal */}
      {isModalOpen && (
        <AddPositionModal onClose={closeModal} queryClient={queryClient} addPosition={addPosition} />
      )}
    </div>
  );
};

export default AdministrativeField;