import { useState } from "react";
import { useNavigate } from "react-router-dom";
import addImage from "../../assets/add.png";
import Modal from "./AddKeyOfficialsModal";
import EditKeyOfficialsModal from "./EditKeyOfficialsModal";
import { RiAddLargeFill } from "react-icons/ri";
import Pen from "../../assets/Pen.png";
import Bin from "../../assets/bin.png";
import Check from "../../assets/Check.png";
import Header from "@/components/Header";
import { IoAlertCircle } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKeyOfficials } from "@/api/keyOfficialsApi";
import { useToast } from "@/hooks/use-toast";
import FeaturePermission from "@/layer/FeaturePermission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPen } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";

const EditKeyOfficials = () => {
  
  const navigate = useNavigate();
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

  const {
    data: officials,
    isLoading,
    isError,
  } = useQuery({
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/keyofficials/archive/${officialId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
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
      await fetch(
        `${import.meta.env.VITE_API_URL}/keyofficials/delete/${officialToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

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
        official.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <div className="w-full">
      {/* Loading Modal */}
      {loadingVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-md bg-white p-6 text-center shadow-md">
            <p className="text-xl font-semibold text-gray-800">
              {loadingMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex w-[75%] flex-col justify-between">
        <Header
          title={"Key Officials"}
          subtitle={
            "Manage university hierarchy, key officials, and their roles."
          }
        />
      </div>

      <div className="mt-6 flex items-center gap-2">
        
          <Input
          type="text"
            placeholder="Search for an official..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

        {/* Add Official Button */}
        <FeaturePermission
          module="Manage Key Officials"
          access="add key official"
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="text-secondary-100-75"
            >
            <RiAddLargeFill /> 
            Add Official
          </Button>
        </FeaturePermission>

        {/* Back Button */}
        <Button
          onClick={handleBack}
          variant="outline"
          className="border-base-200 text-base-200 hover:text-base-200"
          >
          <FaCheck />
          Save
        </Button>
      </div>

      {/* Officials Grid */}
      <div className="mt-6 pt-6">
        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : isError ? (
          <p className="text-gray-600">Error loading officials.</p>
        ) : filteredOfficials.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-5">
            {filteredOfficials.map((official, index) => (
              <div
                key={index}
                className="flex h-[100%] w-[270px] flex-col items-center justify-between rounded-md border border-gray-300 bg-white p-4 shadow-md"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={official.key_official_photo_url}
                    alt={official.name}
                    className="h-[200px] w-[200px] rounded-md object-cover"
                  />
                  <h3 className="text-md font-cizel-decor mt-4 text-center font-bold text-gray-800">
                    {official.name}
                  </h3>
                  <p className="mt-2 font-cizel text-center text-gray-600">
                    {official.position_name}
                  </p>
                </div>

                <div className="flex w-[100%] justify-end gap-[10px] pt-[10px]">
                  <FeaturePermission
                    module="Manage Key Officials"
                    access="edit key official"
                  >
                    <button onClick={() => openEditModal(official)}>
                      <img className="h-[18px]" src={Pen} alt="" />
                    </button>
                  </FeaturePermission>

                  <FeaturePermission
                    module="Manage Key Officials"
                    access="archive key official"
                  >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex w-[500px] flex-col items-center justify-center rounded-md bg-secondary-300 p-6 text-center shadow-md">
            <IoAlertCircle className="text-[3rem] text-base-200" />
            <p className="text-md my-4 text-gray-600">
              Do you want to remove this official?
            </p>
            <div className="mt-4 flex w-[100%] justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-[100%] rounded-md border border-secondary-210 bg-secondary-300 px-4 py-2 text-secondary-210"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-[100%] rounded-md border border-base-200 bg-base-210 px-4 py-2 text-base-200"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex w-[500px] flex-col items-center justify-center rounded-md bg-secondary-300 p-6 text-center shadow-md">
            <IoAlertCircle className="text-[3rem] text-base-200" />
            <p className="text-md my-4 text-gray-600">
              Do you want to archive this official?
            </p>
            <div className="mt-4 flex w-[100%] justify-center gap-4">
              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="w-[100%] rounded-md border border-secondary-210 bg-secondary-300 px-4 py-2 text-secondary-210"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="w-[100%] rounded-md border border-base-200 bg-base-210 px-4 py-2 text-base-200"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <Modal
          closeModal={() => setIsModalOpen(false)}
          addOfficial={handleAddOfficial}
        />
      )}
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
