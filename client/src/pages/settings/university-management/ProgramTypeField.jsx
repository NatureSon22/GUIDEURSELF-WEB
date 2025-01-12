import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProgramTypeData } from "@/api/component-info";
import { addType } from "@/api/university-settings";
import { useToast } from "@/hooks/use-toast";
import EditTypeModal from "./EditTypeModal";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProgramTypeField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: types, isLoading, isError } = useQuery({
    queryKey: ["programtypes"],
    queryFn: getProgramTypeData,
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

  const [newType, setNewType] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleAddType = async () => {
    if (!newType.trim()) return;

    try {
      const response = await addType(newType);
      queryClient.setQueryData(["programtypes"], (oldData) => [
        ...(oldData || []),
        response,
      ]);

      toast({
        title: "Success",
        description: "New program type successfully added",
      });

      setNewType("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "destructive",
      });
    }
  };

  const handleDeleteType = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/campusprogramtypes/${id}`, {
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
    console.log("Selected Program Tyoe:", type); // Log the position
    setSelectedType(type);
    setIsEditModalOpen(true);
  };
  

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedType(null);
  };

  const handleInputChange = (e) => {
    setNewType(e.target.value);
  };

  return (
    <div className="box-shadow-100 space-y-4 rounded-lg bg-white p-4">
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className="text-[0.95rem] font-semibold">Program Type</p>
          <p className="text-[0.85rem] text-secondary-100/60">
            Define program type for university
          </p>
        </div>
        <p className="text-[0.7] font-semibold">New Program Type</p>
        <div className="w-[100%] flex flex-row gap-2">
          <Input
            type="text"
            placeholder="Name of the position"
            value={newType}
            onChange={handleInputChange}
          />
          <Button
            variant="outline"
            className="text-secondary-100-75"
            onClick={handleAddType}
          >
            Add Program Type
          </Button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <p>Loading program type...</p>
          ) : isError ? (
            <p>Error fetching program type.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-center text-[0.9rem]">Program Type</th>
                <th className="p-2 border text-center text-[0.9rem]">Date Added</th>
                <th className="p-2 border text-center text-[0.9rem]">Action</th>
              </tr>
            </thead>
            <tbody>
              {(types || []).length > 0 ? (
                types.map((type) => (
                  <tr key={type._id}>
                    <td className="p-2 border text-[0.9rem w-[702px]">
                      {type.program_type_name}
                    </td>
                    <td className="p-2 border text-center text-[0.9rem]">
                    {formatDate(type.date_added)} 
                    </td>
                    <td className="p-2 border text-[0.9rem] flex gap-2">
                      <Button
                        variant="secondary"
                        className="bg-base-200/10 w-full text-base-200"
                        onClick={() => handleOpenEditModal(type)}
                      >
                      <BiSolidEdit />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="p-1 bg-red-500 w-full text-white rounded-md"
                        onClick={() => handleDeleteType(type._id)}
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

      <EditTypeModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        type={selectedType}
      />

    </div>
  );
};

export default ProgramTypeField;
