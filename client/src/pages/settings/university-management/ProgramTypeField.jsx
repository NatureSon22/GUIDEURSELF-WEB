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
import formatDateTime from "@/utils/formatDateTime";
import AddProgramTypeModal from "./AddProgramTypeModal";

const ProgramTypeField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: types, isLoading, isError } = useQuery({
    queryKey: ["programtypes"],
    queryFn: getProgramTypeData,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredTypes = types
    ? types.filter((type) =>
        type.program_type_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="box-shadow-100 space-y-4 rounded-lg bg-white p-4">
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className="text-[0.95rem] font-semibold">Program Type</p>
          <p className="text-[0.85rem] text-secondary-100/60">
            Define program type for university
          </p>
        </div>
        <div className="w-[100%] flex flex-row gap-2">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button
            variant="outline"
            className="text-secondary-100-75"
            onClick={openModal}
          >
            Add Program Type
          </Button>
        </div>

        <div className="mt-4 h-[200px] overflow-y-auto">
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
                {filteredTypes.length > 0 ? (
                  filteredTypes.map((type) => (
                    <tr key={type._id}>
                      <td className="p-2 border text-[0.9rem w-[702px]">
                        {type.program_type_name}
                      </td>
                      <td className="p-2 border text-center text-[0.9rem]">
                        {formatDateTime(type.date_added)}
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
                      No program types available
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

      {isModalOpen && (
        <AddProgramTypeModal onClose={closeModal} queryClient={queryClient} addType={addType} />
      )}
    </div>
  );
};

export default ProgramTypeField;