import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import addImage from "../../assets/add.png";
import Modal from "./AddKeyOfficialsModal";
import EditKeyOfficialsModal from "./EditKeyOfficialsModal";
import { Input } from "@/components/ui/input";
import Search from "../../assets/Search.png";
import Pen from "../../assets/Pen.png";
import Bin from "../../assets/Bin.png";
import Check from "../../assets/Check.png";
import Header from "@/components/Header";
import { IoAlertCircle } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKeyOfficials } from "@/api/keyOfficialsApi";
import { useToast } from "@/hooks/use-toast"; 
import FeaturePermission from "@/layer/FeaturePermission";
import {loggedInUser} from "@/api/auth.js"

const EditKeyOfficials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [loadingVisible, setLoadingVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [officialToDelete, setOfficialToDelete] = useState(null); // For delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Toggle delete modal
  const [officialToArchive, setOfficialToArchive] = useState(null); // For archive confirmation modal
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false); // Toggle archive modal

  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();

  const navigate = useNavigate();

  const { data: officials, isLoading, isError } = useQuery({
    queryKey: ["keyofficials"],
    queryFn: fetchKeyOfficials,
  });

  const handleAddOfficial = () => {
    queryClient.invalidateQueries(["keyofficials"]); // Trigger a refetch
  };

  const openEditModal = (official) => {
    setSelectedOfficial(official);
    setIsEditModalOpen(true);
  };

  const handleBack = () => {
    setLoadingMessage("Saving Changes...");
    setLoadingVisible(true);

    setTimeout(() => {
      setLoadingMessage("Changes has been successfully saved");
      setTimeout(() => {
        setLoadingVisible(false);
        navigate("/key-officials");
      }, 1500);
    }, 3000);
  };

  const handleArchiveClick = (official) => {
    setOfficialToArchive(official);
    setIsArchiveModalOpen(true); // Open the archive modal
  };
  
  const { mutate: archiveOfficial } = useMutation({
    mutationFn: async (officialId) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/keyofficials/archive/${officialId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to archive official");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["keyofficials"]); // Invalidate the query to trigger a refetch
    },
  });
  
  const handleConfirmArchive = async () => {
    if (!officialToArchive) return;
  
    try {
      await archiveOfficial(officialToArchive._id);
      setOfficialToArchive(null);
      setIsArchiveModalOpen(false); // Close the archive modal
      toast({
        title: "Success",
        description: "Key Official successfully archived.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (official) => {
    setOfficialToDelete(official); // Set the official to delete
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (!officialToDelete) return;

    // Assuming you have a delete mutation setup
    try {
      // Perform delete request, replace with your API call
      await fetch(`${import.meta.env.VITE_API_URL}/keyofficials/delete/${officialToDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setOfficialToDelete(null);
      setIsDeleteModalOpen(false); // Close delete modal
      toast({
        title: "Success",
        description: "Key Official successfully deleted.",
        variant: "default",
      });
      queryClient.invalidateQueries(["keyofficials"]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredOfficials = officials
    ? officials.filter((official) =>
        official.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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

      <div className="flex items-center gap-2 mt-6">
        <div className="h-[40px] w-[90%] flex flex-row justify-between items-center py-1 px-2 rounded-md border-gray-300 border">
          <input
            className="border-none w-[100%] shadow-none h-5 outline-none"
            placeholder="Search for an official..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img className="h-[100%]" src={Search} alt="" />
        </div>

        {/* Add Official Button */}
        <FeaturePermission module="Manage Key Officials" access="add key official">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-md w-[15%] h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300"
          >
            <img className="w-[30px] h-[30px]" src={addImage} alt="Add Officials" />
            Add Official
          </button>
        </FeaturePermission>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="text-md w-[10%] h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-base-200 text-base-200"
        >
          <img className="w-[30px] h-[30px]" src={Check} alt="Save Changes" />
          Save
        </button>
      </div>

      {/* Officials Grid */}
      <div className="pt-6 mt-6">
        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : isError ? (
          <p className="text-gray-600">Error loading officials.</p>
        ) : filteredOfficials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7">
            {filteredOfficials.map((official, index) => (
              <div
                key={index}
                className="p-4 border flex flex-col justify-between items-center w-[270px] h-[100%] border-gray-300 rounded-md shadow-md bg-white"
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
                  <FeaturePermission module="Manage Key Officials" access="edit key official">
                    <button onClick={() => openEditModal(official)}>
                      <img className="h-[18px]" src={Pen} alt="" />
                    </button>
                  </FeaturePermission>

                  <FeaturePermission module="Manage Key Officials" access="archive key official">
                    <button onClick={() => handleArchiveClick(official)}>
                      <img className="h-[25px]" src={Bin} alt="" />
                    </button>
                  </FeaturePermission>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No key officials found.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary-300 p-6 rounded-md shadow-md w-[500px] flex flex-col justify-center items-center text-center">
            <IoAlertCircle className="text-[3rem] text-base-200"/>
            <p className="text-gray-600 my-4 text-md">
              Do you want to remove this official?
            </p>
            <div className="flex justify-center w-[100%] gap-4 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-secondary-210 bg-secondary-300 w-[100%] border border-secondary-210 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 text-base-200 py-2 bg-base-210 w-[100%] border border-base-200 rounded-md"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary-300 p-6 rounded-md shadow-md w-[500px] flex flex-col justify-center items-center text-center">
            <IoAlertCircle className="text-[3rem] text-base-200"/>
            <p className="text-gray-600 my-4 text-md">
              Do you want to archive this official?
            </p>
            <div className="flex justify-center w-[100%] gap-4 mt-4">
              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-2 text-secondary-210 bg-secondary-300 w-[100%] border border-secondary-210 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="px-4 text-base-200 py-2 bg-base-210 w-[100%] border border-base-200 rounded-md"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isModalOpen && 
        <Modal 
          closeModal={() => setIsModalOpen(false)} 
          addOfficial={handleAddOfficial} 
        />
      }
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
