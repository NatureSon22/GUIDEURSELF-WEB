import { useState } from "react";
import addImage from "@/assets/add.png";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPositions } from "@/api/component-info";
import { addPosition } from "@/api/university-settings";
import { useToast } from "@/hooks/use-toast";
import EditPositionModal from "./EditPositionModal";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddPositionModal from "./AddPositionModal";

const AdministrativeField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: positions, isLoading, isError } = useQuery({
    queryKey: ["universitypositions"],
    queryFn: getPositions,
  });

  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Filter positions based on search term
  const filteredPositions = positions
    ? positions.filter((position) =>
        position.position_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="box-shadow-100 space-y-4 rounded-lg bg-white p-4">
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className="text-[0.95rem] font-semibold">Administrative Position</p>
          <p className="text-[0.85rem] text-secondary-100/60">
            Define key administrative positions
          </p>
        </div>
        <div className="w-[100%] flex flex-row gap-2">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search by position name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
          <Button variant="outline" className="text-secondary-100-75" onClick={openModal}>
            Add Position
          </Button>
        </div>

        <div className="mt-4 h-[300px] overflow-y-auto">
          {isLoading ? (
            <p>Loading positions...</p>
          ) : isError ? (
            <p>Error fetching positions.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-center text-[0.9rem]">Position Name</th>
                  <th className="p-2 border text-center text-[0.9rem]">Date Added</th>
                  <th className="p-2 border text-center text-[0.9rem]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.length > 0 ? (
                  filteredPositions.map((position) => (
                    <tr key={position._id}>
                      <td className="p-2 border text-[0.9rem] w-[702px]">
                        {position.position_name}
                      </td>
                      <td className="p-2 border text-center text-[0.9rem]">
                        {formatDate(position.date_added)}
                      </td>
                      <td className="p-2 border text-[0.9rem] flex gap-2">
                        <Button
                          variant="secondary"
                          className="bg-base-200/10 w-full text-base-200"
                          onClick={() => handleOpenEditModal(position)}
                        >
                          <BiSolidEdit />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="p-1 bg-red-500 w-full text-white rounded-md"
                          onClick={() => handleDeletePosition(position._id)}
                        >
                          <MdDelete />
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