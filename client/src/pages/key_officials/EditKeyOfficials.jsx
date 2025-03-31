import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./AddKeyOfficialsModal";
import EditKeyOfficialsModal from "./EditKeyOfficialsModal";
import { RiAddLargeFill } from "react-icons/ri";
import { Skeleton } from "@/components/ui/skeleton";
import Pen from "../../assets/Pen.png";
import Bin from "../../assets/bin.png";
import Header from "@/components/Header";
import useUserStore from "@/context/useUserStore";
import { IoAlertCircle } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKeyOfficials } from "@/api/keyOfficialsApi";
import { useToast } from "@/hooks/use-toast";
import FeaturePermission from "@/layer/FeaturePermission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaCheck } from "react-icons/fa6";
import KeyOfficialLogTable from "./KeyOfficialLogTable";
import { loggedInUser } from "@/api/auth";
import { GrNext, GrPrevious } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";

const ITEMS_PER_PAGE = 10;

const EditKeyOfficials = () => {
  
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useUserStore((state) => state);
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

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

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

  const logActivityMutation = useMutation({
    mutationFn: async (logData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/activitylogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
        credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to log activity");
        }
        return response.json();
        },
  });

  const handleConfirmArchive = async () => {
    if (!officialToArchive) return;

    try {

      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number, // Replace with actual user number
        username: currentUser.username, // Replace with actual username
        firstname: currentUser.firstname, // Replace with actual firstname
        lastname: currentUser.lastname, // Replace with actual lastname
        role_type: currentUser.role_type, // Replace with actual role type
        campus_name: currentUser.campus_name, // Replace with actual campus name
        action: `Archived key official: ${officialToArchive.name}`,
        date_created: officialToArchive.date_added,
        date_last_modified: Date.now(),
    });
      archiveOfficial(officialToArchive._id);
      const logResponse = await fetch(`${import.meta.env.VITE_API_URL}/keyofficiallogs`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: officialToArchive.name || "Unknown Name",
          activity: `Archived an official ${officialToArchive.name}`,
          updated_by: data?.username || "Unknown User",
        }),
      });
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

    
        if (isLoading) {
          return <Skeleton className="rounded-md bg-secondary-200/40 py-24" />;
        }
  
    const totalPages = Math.ceil(filteredOfficials.length / ITEMS_PER_PAGE);
    
    const paginatedOfficials = filteredOfficials.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

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
          <div>
      {/* Officials Grid */}
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-5">
            {paginatedOfficials.map((official, index) => (
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

          {/* Pagination Controls */}
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              className="font-semibold text-secondary-100-75"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <GrPrevious />
              Previous
            </Button>
              <Input
                type="number"
                min="1"
                value={currentPage}
                className="w-16 rounded border p-1 text-center"
              />
            <Button
              variant="outline"
              className="font-semibold text-secondary-100-75"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <GrNext />
            </Button>
          </div>
        </div>
        ) : (
          <p className="text-gray-600">No key officials found.</p>
        )}
      </div>
      <div
        className="mt-[40px]"
      >
      <Header
        className="mb-4"
        title={"Key Official Log"}
        subtitle={"This section lists the most recent updates and changes made by administration for different key officials."}
        />
      <KeyOfficialLogTable />

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
