import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import addImage from "../../assets/add.png";
import Modal from "./AddKeyOfficialsModal";
import EditKeyOfficialsModal from "./EditKeyOfficialsModal";
import Search from "../../assets/Search.png";
import Pen from "../../assets/Pen.png";
import Bin from "../../assets/Bin.png";
import Check from "../../assets/Check.png";
import Header from "@/components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKeyOfficials } from "@/api/keyOfficialsApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditKeyOfficials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [loadingVisible, setLoadingVisible] = useState(false); 
  const [loadingMessage, setLoadingMessage] = useState(""); 
  const [officialToDelete, setOfficialToDelete] = useState(null); 

  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState(""); 

  const navigate = useNavigate();

  const { data: officials, isLoading, isError } = useQuery({
    queryKey: ["keyofficials"],
    queryFn: fetchKeyOfficials,
  });

  const { mutate: deleteOfficial } = useMutation({
    mutationFn: async (officialId) => {
      const res = await fetch(`http://localhost:3000/api/keyofficials/${officialId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to delete official");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["keyofficials"]); // Invalidate the query to trigger a refetch
    },
  });
  
  const handleAddOfficial = () => {
    queryClient.invalidateQueries(["keyofficials"]); // Trigger a refetch
  };
  
  const openEditModal = (official) => {
    console.log("Selected Official:", official);
    setSelectedOfficial(official);
    setIsEditModalOpen(true);
  };

  const handleBack = () => {
    setLoadingMessage("Saving Changes...");
    setLoadingVisible(true);
  
    setTimeout(() => {
      setLoadingMessage("Changes have been successfully saved!");
      setTimeout(() => {
        setLoadingVisible(false);
        navigate("/key-officials");  
      }, 1500);
    }, 3000);
  };

  const handleDeleteClick = (official) => {
    setOfficialToDelete(official);
  };

  const handleConfirmDelete = async () => {
    if (!officialToDelete) return;
  
    try {
      deleteOfficial(officialToDelete._id);
      setOfficialToDelete(null); 
    } catch (error) {
      console.error("Error deleting official:", error);
    }
  };
  
  const filteredOfficials = officials?.filter((official) =>
    official.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading data.</p>;
  }

  return (
    <div className="w-full">
      {/* Loading Modal */}
      {loadingVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
          </div>
        </div>
      )}

      <div className="w-[75%] flex flex-col justify-between">
        <Header
          title={"Key Officials"}
          subtitle={
            "Manage university hierarchy, key officials, and their roles."
          }
        />
      </div>

      <div className="w-full pt-6 flex gap-4">
        <div className="w-[80%] h-[40px] flex flex-row justify-between items-center py-1 px-2 rounded-md border-gray-300 border">
          <textarea
            className="overflow-hidden w-[95%] h-5 resize-none outline-none"
            placeholder="Search for an official..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img className="h-[100%]" src={Search} alt="" />
        </div>

        {/* Add Official Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-[12%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300"
        >
          <img className="w-[30px] h-[30px]" src={addImage} alt="Add Officials" />
          Add Official
        </button>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-[7%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300"
        >
          <img className="w-[30px] h-[30px]" src={Check} alt="Save Changes" />
          Save
        </button>
      </div>

      {/* Officials Grid */}
      <div className="pt-6 mt-6">
        {filteredOfficials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7">
            {filteredOfficials.map((official, index) => (
              <div
                key={index}
                className="p-4 border flex flex-col justify-between items-center w-[250px] h-[100%] border-gray-300 rounded-md shadow-md bg-white"
              >
                <div className="flex items-center flex-col">
                  <img
                    src={official.key_official_photo_url}
                    alt={official.name}
                    className="w-[200px] h-[200px] object-cover rounded-md"
                  />
                  <h3 className="mt-4 text-center text-md font-bold text-gray-800">
                    {official.name}
                  </h3>
                  <p className="mt-2 text-center text-gray-600">{official.position_name}</p>
                </div>

                <div className="flex w-[100%] pt-[10px] justify-end gap-[10px]">
                  <button onClick={() => openEditModal(official)}>
                    <img className="h-[18px]" src={Pen} alt="" />
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger onClick={() => handleDeleteClick(official)}>
                      <img className="h-[25px]" src={Bin} alt="" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">
                          Do you want to remove this official?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-row !justify-center gap-[10px]">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleConfirmDelete}
                          className="bg-blue-500 text-white w-[100px] p-2 rounded-md"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No key officials found.</p>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && <Modal closeModal={() => setIsModalOpen(false)} addOfficial={handleAddOfficial} />}
      {isEditModalOpen && (
        <EditKeyOfficialsModal
          official={selectedOfficial}
          closeModal={() => setIsEditModalOpen(false)}
          onUpdate={() => {
            queryClient.invalidateQueries(["keyofficials"]); // Refetch data after update
          }}
        />
      )}

    </div>
  );
};

export default EditKeyOfficials;
