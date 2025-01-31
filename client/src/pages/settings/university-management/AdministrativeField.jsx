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


const AdministrativeField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: positions, isLoading, isError } = useQuery({
    queryKey: ["universitypositions"],
    queryFn: getPositions,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month (0-based index, so add 1)
    const year = String(date.getFullYear()).slice(-2); // Last two digits of the year
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes with leading zero
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12; // Convert to 12-hour format
  
    return `${day}-${month}-${year} ${hour12}:${minutes} ${ampm}`;
  };

  const [newPosition, setNewPosition] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleAddPosition = async () => {
    if (!newPosition.trim()) return;

    try {
      const response = await addPosition(newPosition);
      queryClient.setQueryData(["universitypositions"], (oldData) => [
        ...(oldData || []),
        response,
      ]);

      toast({
        title: "Success",
        description: "New position successfully added",
      });

      setNewPosition("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
      });
    }
  };

  const handleDeletePosition = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/administartiveposition/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete position");
      }

      queryClient.invalidateQueries(["universitypositions"]);

      toast({
        title: "Success",
        description: "Position deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
      });
    }
  };

  const handleOpenEditModal = (position) => {
    console.log("Selected Position:", position); // Log the position
    setSelectedPosition(position);
    setIsEditModalOpen(true);
  };
  

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPosition(null);
  };

  const handleInputChange = (e) => {
    setNewPosition(e.target.value);
  };

  return (
    <div className="box-shadow-100 space-y-4 rounded-lg bg-white p-4">
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className="text-[0.95rem] font-semibold">Administrative Position</p>
          <p className="text-[0.85rem] text-secondary-100/60">
            Define key administrative positions
          </p>
        </div>
        <p className="text-[0.7] font-semibold">New Position</p>
        <div className="w-[100%] flex flex-row gap-2">
          <Input
            type="text"
            placeholder="Name of the position"
            value={newPosition}
            onChange={handleInputChange}
          />
          <Button
            variant="outline"
            className="text-secondary-100-75"
            onClick={handleAddPosition}
          >
            Add Position
          </Button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <p>Loading positions...</p>
          ) : isError ? (
            <p>Error fetching positions.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-center text-[0.9rem]">Position Name</th>
                <th className="p-2 border text-center text-[0.9rem]">Date Added</th>
                <th className="p-2 border text-center text-[0.9rem]">Action</th>
              </tr>
            </thead>
            <tbody>
              {(positions || []).length > 0 ? (
                positions.map((position) => (
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
                        className="bg-base-200/10 text-base-200"
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
                  <td className="p-2 border" colSpan="3">
                    No positions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          )}
        </div>
      </div>

      <EditPositionModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        position={selectedPosition}
      />

    </div>
  );
};

export default AdministrativeField;
