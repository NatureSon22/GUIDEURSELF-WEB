import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMajorData } from "@/api/component-info";
import { useToast } from "@/hooks/use-toast";
import AddMajorModal from "./AddMajorModal";
import EditMajorModal from "./EditMajorModal";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import formatDateTime from "@/utils/formatDateTime";

const MajorField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: majors, isLoading, isError } = useQuery({
    queryKey: ["majornames"],
    queryFn: getMajorData,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  const filteredMajors = majors
  ? majors.filter(
      (major) =>
        major.majorname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        major.programname.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

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
    <div className="box-shadow-100 space-y-4 rounded-lg bg-white p-4">
      <div className="flex justify-between flex-col gap-4">
        <div>
          <p className="text-[0.95rem] font-semibold">Major List</p>
          <p className="text-[0.85rem] text-secondary-100/60">
            Manage and oversee the major of university
          </p>
        </div>
        <div className="w-[100%] flex flex-row gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <Button
            variant="outline"
            className="text-secondary-100-75"
            onClick={openModal}
          >
            Add New Major
          </Button>
        </div>

        <div className="mt-4 h-[300px] overflow-y-auto">
          {isLoading ? (
            <p>Loading all major...</p>
          ) : isError ? (
            <p>Error fetching all major.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-center text-[0.9rem]">Program Name</th>
                  <th className="p-2 border text-center text-[0.9rem]">Major Name</th>
                  <th className="p-2 border text-center text-[0.9rem]">Date Added</th>
                  <th className="p-2 border text-center text-[0.9rem]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMajors.length > 0 ? (
                  filteredMajors.map((major) => (
                    <tr key={major._id}>
                      <td className="p-2 border text-[0.9rem]">{major.programname}</td>
                      <td className="p-2 border text-center text-[0.9rem]">
                        {major.majorname}
                      </td>
                      <td className="p-2 border text-center text-[0.9rem]">
                        {formatDateTime(major.date_added)}
                      </td>
                      <td className="p-2 border text-[0.9rem] flex gap-2">
                        <Button
                          variant="secondary"
                          className="bg-base-200/10 w-full text-base-200"
                          onClick={() => handleOpenEditModal(major)}
                        >
                          <BiSolidEdit />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="p-1 bg-red-500 w-full text-white rounded-md"
                          onClick={() => handleDeleteMajor(major._id)}
                        >
                          <MdDelete />
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