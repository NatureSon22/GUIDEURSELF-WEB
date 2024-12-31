import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import addImage from "../../assets/add.png";
import Modal from "./AddKeyOfficialsModal";
import EditKeyOfficialsModal from "./EditKeyOfficialsModal";
import Search from "../../assets/Search.png";
import Pen from "../../assets/Pen.png";
import Bin from "../../assets/Bin.png";
import Check from "../../assets/Check.png";
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
  const [officials, setOfficials] = useState([]);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [loadingVisible, setLoadingVisible] = useState(false); // For loading modal
  const [loadingMessage, setLoadingMessage] = useState(""); // Loading message text

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Delete confirmation modal visibility
  const [officialToDelete, setOfficialToDelete] = useState(null); // Official to be deleted

  const [searchQuery, setSearchQuery] = useState(""); 

  const navigate = useNavigate();

  // Fetch key officials
  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/keyofficials",  {method:"get", credentials:"include"});
        if (!response.ok) {
          throw new Error("Failed to fetch officials");
        }
        const data = await response.json();
        setOfficials(data);
      } catch (error) {
        console.error("Error fetching key officials:", error);
      }
    };

    fetchOfficials();
  }, []);

  // Add a new official
  const addOfficial = (newOfficial) => {
    setOfficials((prevOfficials) => [...prevOfficials, newOfficial]);
  };

  // Open Edit Modal
  const openEditModal = (official) => {
    setSelectedOfficial(official);
    setIsEditModalOpen(true);
  };

  // Handle Back Button
  const handleBack = () => {
    setLoadingMessage("Saving Changes...");
    setLoadingVisible(true);
  
    setTimeout(() => {
      setLoadingMessage("Changes have been successfully saved!");
      setTimeout(() => {
        setLoadingVisible(false);
        navigate("/key-officials");  // Navigate back to the key officials list
      }, 1500);
    }, 3000);
  };
  
  // Handle Delete Button Click
  const handleDeleteClick = (official) => {
    setOfficialToDelete(official);
  };

  // Proceed with Deletion
  const handleConfirmDelete = async () => {
    if (!officialToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/keyofficials/${officialToDelete._id}`,
        { method: "DELETE", credentials:"include" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete official");
      }

      setOfficials((prevOfficials) =>
        prevOfficials.filter((official) => official._id !== officialToDelete._id)
      );

      setOfficialToDelete(null); // Clear the selected official
    } catch (error) {
      console.error("Error deleting official:", error);
    }
  };

  // Filter officials based on the search query
  const filteredOfficials = officials.filter((official) =>
    official.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full p-6">
      {/* Loading Modal */}
      {loadingVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      

      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <div>        
          <h2 className="text-2xl font-bold text-gray-800">Key Officials</h2>
          <p className="text-gray-600 mt-2">
            Manage university hierarchy, key officials, and their roles.
          </p>
        </div>
      </div>

      {/* Buttons Section */}
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
          <img className="w-[30px] h-[30px]" src={Check} alt="Add Officials" />
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
                {/* Official's Details */}
                <h3 className="mt-4 text-center text-md font-bold text-gray-800">
                  {official.name}
                </h3>
                <p className="mt-2 text-center text-gray-600">{official.position_name}</p>
                </div>
                {/* Official's Photo */}
                
                <div className="flex w-[100%] pt-[10px] justify-end gap-[10px]">
                    <button
                      onClick={() => openEditModal(official)}
                    ><img className="h-[18px]" src={Pen} alt="" />
                    </button>
                
                    <AlertDialog>
                    <AlertDialogTrigger  onClick={() => handleDeleteClick(official)}
                      ><img className="h-[25px]" src={Bin} alt="" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">
                        Do you want to remove this official?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-row !justify-center gap-[10px]">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}
                        className="bg-blue-500 text-white w-[100px] p-2 rounded-md"
                        >Continue
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
      {isModalOpen && <Modal closeModal={() => setIsModalOpen(false)} addOfficial={addOfficial} />}
      {isEditModalOpen && (
        <EditKeyOfficialsModal
          official={selectedOfficial}
          closeModal={() => setIsEditModalOpen(false)}
          onUpdate={(updatedOfficial) =>
            setOfficials((prevOfficials) =>
              prevOfficials.map((official) =>
                official._id === updatedOfficial._id ? updatedOfficial : official
              )
            )
          }
        />
      )}
    </div>
  );
};

export default EditKeyOfficials;

