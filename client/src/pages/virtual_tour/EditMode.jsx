import { useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Gallery from "@/assets/Gallery.png";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";
import L from "leaflet";
import AddFloorModal from "./AddFloorModal";
import { useQueryClient } from "@tanstack/react-query";
import Add from "@/assets/add.png";
import Minus from "@/assets/minus.png";
import Pen from "@/assets/Pen.png";
import HeaderSection from "./HeaderSection";
import FloorList from "./FloorList";
import MapViewer from "./MapViewer";
import ConfirmationDialog from "./ConfirmationDialog";

const fetchCampusData = async (campusId) => {
  const response = await fetch(`http://localhost:3000/api/campuses/${campusId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch campus data");
  }

  return response.json();
};

const EditMode = () => {
  const location = useLocation();
  const { campus } = location.state || {};
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const [floorToRemove, setFloorToRemove] = useState(null); // Store floor to be removed
  const queryClient = useQueryClient();

  const { data: university } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  const { data: updatedCampus } = useQuery({
    queryKey: ["campuses", campus._id],
    queryFn: () => fetchCampusData(campus._id),
    initialData: campus,
  });

  if (!updatedCampus) {
    return <p>No campus data provided. Please select a campus first.</p>;
  }

  const handleAddFloorClick = () => {
    console.log("Adding floor...");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const refreshFloors = () => {
    queryClient.invalidateQueries(["campuses", campus._id]);
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      // When exiting edit mode, save changes to the server
      try {
        const response = await fetch(`http://localhost:3000/api/campuses/${campus._id}/floors`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ floors: updatedCampus.floors }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to save floor data");
        }
  
        console.log("Floors updated successfully");
  
        // Refresh data from the server
        refreshFloors();
      } catch (error) {
        console.error("Error saving floor data:", error);
      }
    }
  
    // Toggle editing mode
    setIsEditing(!isEditing);
  };
  

  const confirmRemoveFloor = (floorIndex) => {
    setFloorToRemove(floorIndex);
    setIsDialogOpen(true);
  };

  const handleCancelRemove = () => {
    setIsDialogOpen(false);
    setFloorToRemove(null);
  };

  const handleProceedRemove = () => {
    if (floorToRemove !== null) {
      // Remove the floor locally from the updatedCampus object
      const updatedFloors = [...updatedCampus.floors];
      updatedFloors.splice(floorToRemove, 1);
  
      // Simulate the state change by invalidating the query cache and setting local data
      queryClient.setQueryData(["campuses", campus._id], {
        ...updatedCampus,
        floors: updatedFloors,
      });
  
      console.log(`Floor at index ${floorToRemove} removed from UI.`);
    }
  
    // Close the dialog and clear the floorToRemove state
    setIsDialogOpen(false);
    setFloorToRemove(null);
    setSelectedFloor(null);
  };
  
    return (
      <div className="flex">
        <div className="w-[40%] flex flex-col justify-between px-6 gap-3 min-h-screen border-r">
          <div>
            <HeaderSection university={university} updatedCampus={updatedCampus} />
            <FloorList
              floors={updatedCampus.floors}
              selectedFloor={selectedFloor}
              isEditing={isEditing}
              toggleEditMode={toggleEditMode}
              confirmRemoveFloor={confirmRemoveFloor}
              setSelectedFloor={setSelectedFloor}
              handleAddFloorClick={handleAddFloorClick}
            />
          </div>
            <div className="py-6 flex gap-4">
              <Link
                className="flex justify-center items-center h-[45px] rounded-md px-[50px] w-[100%] text-base-200 hover:bg-secondary-350"
                to="/virtual-tour/build-mode"
              >
                <button>Return View</button>
              </Link>
              <Link
                className="flex justify-center items-center h-[45px] rounded-md px-[50px] w-[100%] text-accent-100 bg-accent-500 hover:bg-accent-100 hover:text-white"
                to="/virtual-tour"
              >
                <button>Exit Build Mode</button>
              </Link>
            </div>
        </div>
        <div className="w-[100%] z-[10]">
          <MapViewer selectedFloor={selectedFloor} />
        </div>
        {isModalOpen && (
          <AddFloorModal closeModal={closeModal} campusId={campus._id} refreshFloors={refreshFloors} />
        )}
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onCancel={handleCancelRemove}
          onProceed={handleProceedRemove}
        />
      </div>
    );
  }

export default EditMode;
