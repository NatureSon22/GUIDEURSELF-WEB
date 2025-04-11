import "leaflet/dist/leaflet.css";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";
import LoadingFallback from "@/components/LoadingFallback";
import AddFloorModal from "./AddFloorModal";
import EditFloorModal from "./EditFloorModal";
import HeaderSection from "./HeaderSection";
import useUserStore from "@/context/useUserStore";
import { MapContainer, ImageOverlay, Marker, useMapEvents,Rectangle , TileLayer, useMap , Popup } from "react-leaflet";
import { useState, useEffect, StrictMode, useRef, Suspense  } from "react";
import L from "leaflet"; 
import AddMarkerModal from "./AddMarkerModal";
import ConfirmationDialog from "./ConfirmationDialog";
import { Label } from "@/components/ui/label";
import PreviewPanorama from "./PreviewPanorama";
import DeleteMarkerConfirmationDialog from "./DeleteMarkerConfirmationDialog"
import EditMarkerModal from "./EditMarkerModal";
import { GoAlert } from "react-icons/go";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { MdClose } from "react-icons/md";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { LuPlus } from "react-icons/lu";
import { FaPen } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { renderToString } from "react-dom/server";
import { BsDoorOpenFill } from "react-icons/bs";
import { PiOfficeChairFill } from "react-icons/pi";
import { FaGraduationCap } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { ImManWoman } from "react-icons/im";  
import { MdWidgets } from "react-icons/md";
import { renderToStaticMarkup } from "react-dom/server";
import { FaInfo } from "react-icons/fa6";
import { loggedInUser } from "@/api/auth";
import Loading from "@/components/Loading";
import "@/fluttermap.css";
import { FaStar } from "react-icons/fa6";

const tailwindClasses = `
  bg-yellow-500 bg-red-500 bg-blue-500 bg-green-500 bg-pink-500 bg-blue-400
  border-yellow-500 border-red-500 border-blue-500 border-green-500 border-pink-500 border-blue-400
`;

const categoryConfig = {
  "Academic Spaces": { color: "bg-yellow-500", textColor: "text-yellow-500", borderColor: "border-yellow-500", icon: BsDoorOpenFill },
  "Administrative Offices": { color: "bg-red-500", textColor: "text-red-500", borderColor: "border-red-500", icon: PiOfficeChairFill },
  "Student Services": { color: "bg-blue-500", textColor: "text-blue-500", borderColor: "border-blue-500", icon: FaGraduationCap },
  "Campus Attraction": { color: "bg-green-500", textColor: "text-green-500", borderColor: "border-green-500", icon: FaFlag },
  "Utility Areas": { color: "bg-pink-500", textColor: "text-pink-500", borderColor: "border-pink-500", icon: ImManWoman },
  "Multi-Purpose": { color: "bg-orange-400", textColor: "text-orange-500", borderColor: "border-orange-400", icon: FaStar },
  "Others (Miscellaneous)": { color: "bg-purple-400", textColor: "text-purple-500", borderColor: "border-purple-400", icon: MdWidgets },
};

const MarkerIcon = ({ bgColor, IconComponent }) => (
  <div className="relative">
    <div className={`flex items-center justify-center w-[45px] h-[45px] rounded-full pl-[2px] ${bgColor} relative z-10`}>
      <IconComponent color="white" size={25} className="" />
    </div>
    <div className={`absolute top-[0px] left-[0px] w-[45px] h-[45px] rounded-full ${bgColor} opacity-100 animate-ping`}></div>
  </div>
);

// Create a default version of MarkerIcon
const DefaultMarkerIcon = ({ bgColor = "bg-base-200" }) => (
  <div className="relative">
    <div className={`flex items-center justify-center w-[45px] h-[45px] rounded-full pl-[2px] ${bgColor} relative z-10`}>
      <FaInfo color="white" size={25} className="" />
    </div>
    <div className={`absolute top-[5px] left-[5px] w-[35px] h-[35px] rounded-full ${bgColor} opacity-100 animate-ping`}></div>
  </div>
);


const createIcon = (category, isSelected = false) => {
  const grayColor = "bg-base-450"; // Gray color for selected marker
  
  // If no category is provided
  if (!category) {
    // If the marker is selected, set it to gray, else use the default color
    const defaultColor = isSelected ? grayColor : "bg-base-200";
    return L.divIcon({
      html: renderToString(<DefaultMarkerIcon bgColor={defaultColor} />),
      className: "custom-marker",
      iconSize: [35, 35],
      iconAnchor: [25, 20],
    });
  }

  // If there's a category, retrieve its color
  const { color, icon: IconComponent } = categoryConfig[category] || {};

  // If no icon, fallback to gray for selected markers
  const finalColor = isSelected ? grayColor : color || "bg-base-200"; // Default to base color if no category

  return L.divIcon({
    html: renderToString(
      <MarkerIcon bgColor={finalColor} IconComponent={IconComponent || FaInfo} />
    ),
    className: "custom-marker",
    iconSize: [35, 35],
    iconAnchor: [25, 20],
  });
};

const getIcon = (category, isSelected = false) => {
  return createIcon(category, isSelected);
};

const customIcons = new Proxy({}, {
  get: (target, category) => target[category] || (target[category] = createIcon(category))
});

const FlyToSelectedMarker = ({ selectedMarker  }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedMarker) {
      const lat = parseFloat(selectedMarker.latitude);
      const lng = parseFloat(selectedMarker.longitude);

      map.flyTo([lat, lng], 19, {
        duration: 1, // smooth 1.5 second fly
      });
      
    }
  }, [selectedMarker, map]);

  return null;
};

const FlyToSelectMarker = ({ selectMarker, markerRefs }) => {
  const map = useMap();

  useEffect(() => {
    if (selectMarker && markerRefs.current[selectMarker._id]) {
      const marker = markerRefs.current[selectMarker._id];
      const lat = parseFloat(selectMarker.latitude);
      const lng = parseFloat(selectMarker.longitude);

      map.flyTo([lat, lng], 19, {
        duration: 1, // smooth 1.5 second fly
      });
      setTimeout(() => marker.openPopup(), 300);
    }
  }, [selectMarker, map]);

  return null;
};

const fetchCampusData = async (campusId) => {

  const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses/${campusId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch campus data");
  }

  const data = await response.json();

  data.floors.forEach((floor) => {
    if (!floor.markers) {
      floor.markers = []; 
    }
  });

  return data;
};

const EditMode = () => {
  const location = useLocation();
const navigate = useNavigate();
const queryClient = useQueryClient();

const { campus } = location.state || {};
const [selectedCategory, setSelectedCategory] = useState("");
const { currentUser } = useUserStore((state) => state);
const modalRef = useRef(null);
const [editingFloor, setEditingFloor] = useState(null);
const [hideMarkers, setHideMarkers] = useState(false);
const bounds = [[14.480740, 121.184750], [14.488870, 121.192500]];
const [draggedFloor, setDraggedFloor] = useState(null);
const [dragOverFloor, setDragOverFloor] = useState(null);
const [selectedFloor, setSelectedFloor] = useState(null);
const [selectedMarker, setSelectedMarker] = useState(null);
const [selectMarker, setSelectMarker] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [isMarkerDialogOpen, setIsMarkerDialogOpen] = useState(false);
const [markerToRemove, setMarkerToRemove] = useState(null);
const [floorToRemove, setFloorToRemove] = useState(null);
const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
const [currentMarkers, setCurrentMarkers] = useState([]);
const [isAddMarkerModalOpen, setAddMarkerModalOpen] = useState(false);
const [loadingVisible, setLoadingVisible] = useState(false);
const [isRemove, setIsRemove] = useState(false);
const [popupInstance, setPopupInstance] = useState(null);
const [expandedFloor, setExpandedFloor] = useState(null);
const [isSliderOpen, setIsSliderOpen] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const [loadingMessage, setLoadingMessage] = useState("");
const [isPanorama, setIsPanorama] = useState(false);
const [previewImage, setPreviewImage] = useState("");
const [markerName, setMarkerName] = useState("");
const [markerDescription, setMarkerDescription] = useState("");
const [markerCategory, setMarkerCategory] = useState("");
  const markerRefs = useRef({});

const showPanorama = (marker) => {
  setPreviewImage(marker.marker_photo_url);
  setMarkerName(marker.marker_name);
  setMarkerDescription(marker.marker_description);
  setMarkerCategory(marker.category);
  setIsPanorama(true);
};

   useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setIsPanorama(false); // Close when clicking outside
        }
      };
  
      if (isPanorama) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isPanorama]);

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

const toggleSlider = () => {
  setIsSliderOpen(!isSliderOpen);
};

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

const removeAlert = () => {
  setIsRemove(true);
};

const toggleFloor = (floorId) => {
  setExpandedFloor((prev) => (prev === floorId ? null : floorId));
};

const handleExitBuildMode = () => {
  setLoadingMessage("Exiting Build Mode");
  setLoadingVisible(true);

  setTimeout(() => {
    setLoadingVisible(false);
    navigate("/virtual-tour");
  }, 3000);
};

const handleMarkerClick = (marker) => { 
  setSelectedMarker(marker);
  setHideMarkers(true);
  toggleSlider();
};


const handleMarkerClicked = (marker) => { 
  setSelectMarker(marker);
};

const handleCloseEditMarkerModal = () => {
  setSelectedMarker(null);
  setIsSliderOpen(true);
  setSelectedCategory("");
  setIsRemove(false);
  setHideMarkers(false);
  setCoordinates({ lat: null, lng: null });
};

const handleSelectFloor = (floor) => {
  setSelectedFloor(floor);
  setCoordinates({ lat: null, lng: null });
};

const fetchMarkers = async () => {
  if (!selectedFloor) return [];
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/campuses/floors/${selectedFloor._id}/markers`,
      { credentials: "include" }
    );
    if (!response.ok) throw new Error("Failed to fetch markers.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching markers:", error);
    return [];
  }
};

const refreshMarkers = async () => {
  const updatedMarkers = await fetchMarkers();
  setCurrentMarkers(updatedMarkers);
};

useEffect(() => {
  if (selectedFloor) {
    setCurrentMarkers(selectedFloor.markers || []);
  } else {
    setCurrentMarkers([]);
  }
}, [selectedFloor]);

useEffect(() => {
  if (selectedFloor) {
    refreshMarkers();
  }
}, [selectedFloor, isAddMarkerModalOpen]);


const handleCloseModal = () => {
  setAddMarkerModalOpen(false);
  setIsSliderOpen(true);
  setHideMarkers(false);
  setSelectedCategory("");
  setIsRemove(false);
  setCoordinates({ lat: null, lng: null });
};

const { data: university } = useQuery({
  queryKey: ["universitysettings"],
  queryFn: getUniversityData,
});

const { data: updatedCampus } = useQuery({
  queryKey: ["campuses", campus?._id],
  queryFn: () => fetchCampusData(campus._id),
  enabled: !!campus, 
  initialData: campus,
});

if (!university) return <div>Loading...</div>;
if (!updatedCampus) return <p>No campus data provided. Please select a campus first.</p>;

const handleAddFloorClick = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);
const refreshFloors = () => queryClient.invalidateQueries(["campuses", campus._id]);

const LocationMarker = () => {
  const [isSliderOpen] = useState(false);
  const isSliderOpenRef = useRef(isSliderOpen);

  useEffect(() => {
    isSliderOpenRef.current = isSliderOpen;
  }, [isSliderOpen]);

  useMapEvents({
    click(e) {
      // Enhanced check - verify this is a direct map click
      if (!isSliderOpenRef.current && e.originalEvent.target === e.target._container) {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lng });
        removeAlert();
      }
    },
  });
  
  const icon = getIcon(selectedCategory);

  return coordinates.lat ? (
    <Marker 
      position={[coordinates.lat, coordinates.lng]}
      icon={icon} 
      eventHandlers={{
        click: (e) => e.originalEvent.stopPropagation() // Prevent marker clicks from bubbling
      }}
    />
  ) : null;
};

const handleAddMarkerClick = () => {
  setAddMarkerModalOpen(true);
  setHideMarkers(true);
  toggleSlider();
};


const toggleEditMode = async () => {
  if (isEditing) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/campuses/${campus._id}/floors`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ floors: updatedCampus.floors }),
        }
      );

      if (!response.ok) throw new Error("Failed to save floor data");

      

      console.log("Floors updated successfully");
      refreshFloors();
    } catch (error) {
      console.error("Error saving floor data:", error);
    }
  }
  setIsEditing(!isEditing);
  setIsRemove(false);
};

const confirmRemoveFloor = (floor) => {
  setFloorToRemove(floor._id);
  setIsDialogOpen(true);
  console.log(floor._id)
};

const revertMarkers = () => {
  setHideMarkers(false);
}

const handleCancelRemove = () => {
  setIsDialogOpen(false);
  setFloorToRemove(null);
};

const handleProceedRemove = async () => {
  if (floorToRemove) {
    try {
      const floorToArchive = updatedCampus.floors.find(
        (floor) => floor._id === floorToRemove
      );

      if (!floorToArchive) {
        console.error("Floor not found");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/campuses/${campus._id}/floors/${floorToRemove}/archive`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            type: "floor", 
            floor_data: floorToArchive, 
            campus_id: campus._id, 
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to archive floor");

      const logResponse = await fetch(`${import.meta.env.VITE_API_URL}/virtualtourlogs`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campus_name: campus.campus_name || "Unknown Campus",
          activity: `Archived a floor: ${floorToArchive.floor_name}`,
          updated_by: `${data?.firstname} ${data?.lastname}` || "Unknown User",
        }),
      });

      if (!logResponse.ok) {
        console.error("Failed to log archiving activity:", logResponse.statusText);
      }

      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number, // Replace with actual user number
        username: currentUser.username, // Replace with actual username
        firstname: currentUser.firstname, // Replace with actual firstname
        lastname: currentUser.lastname, // Replace with actual lastname
        role_type: currentUser.role_type, // Replace with actual role type
        campus_name: currentUser.campus_name, // Replace with actual campus name
        action: `Archived existing floor: ${floorToArchive.floor_name}`,
        date_created: floorToArchive.date_added,
        date_last_modified: Date.now(),
    });

      const updatedFloors = updatedCampus.floors.filter(
        (floor) => floor._id !== floorToRemove
      );

      queryClient.setQueryData(["campuses", campus._id], {
        ...updatedCampus,
        floors: updatedFloors,
      });

      console.log(`Floor with ID ${floorToRemove} archived successfully.`);
    } catch (error) {
      console.error("Error archiving floor:", error);
    }
  }

  setIsDialogOpen(false);
  setFloorToRemove(null);
  setSelectedFloor(null);
};

const confirmRemoveMarker = (marker) => {
  setMarkerToRemove(marker);
  setIsMarkerDialogOpen(true);
};

const handleCancelRemoveMarker = () => {
  setIsMarkerDialogOpen(false);
  setMarkerToRemove(null);
};

const handleProceedRemoveMarker = async () => {
  if (markerToRemove && selectedFloor) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/campuses/${campus._id}/floors/${selectedFloor._id}/markers/${markerToRemove._id}/archive`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            type: "location", 
            location_data: markerToRemove, 
            campus_id: campus._id, 
            campus_name: campus.campus_name, // Add campus_name to the request body
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to archive marker");

      const logResponse = await fetch(`${import.meta.env.VITE_API_URL}/virtualtourlogs`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campus_name: campus.campus_name || "Unknown Campus",
          activity: `Archived a location ${markerToRemove.marker_name}`,
          updated_by: `${data?.firstname} ${data?.lastname}` || "Unknown User",
        }),
      });

      if (!logResponse.ok) {
        console.error("Failed to log archiving activity:", logResponse.statusText);
      }

      console.log(`Marker with ID ${markerToRemove._id} archived successfully.`);

      
      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number, // Replace with actual user number
        username: currentUser.username, // Replace with actual username
        firstname: currentUser.firstname, // Replace with actual firstname
        lastname: currentUser.lastname, // Replace with actual lastname
        role_type: currentUser.role_type, // Replace with actual role type
        campus_name: currentUser.campus_name, // Replace with actual campus name
        action: `Archived existing location: ${markerToRemove.marker_name}`,
        date_created: markerToRemove.date_added,
        date_last_modified: Date.now(),
    });

      refreshFloors();
      refreshMarkers();
    } catch (error) {
      console.error("Error archiving marker:", error);
    }
  }

  setIsMarkerDialogOpen(false);
  setMarkerToRemove(null);
};


const floors = updatedCampus?.floors || [];
const totalFloors = floors.length;

// Replace the filteredFloors logic with this:
const filteredMarkers = floors?.flatMap(floor => 
  floor.markers?.filter(marker => 
    marker.marker_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []
);

const updateFloorsOrder = (newFloors) => {
  queryClient.setQueryData(["campuses", campus._id], (oldData) => ({
    ...oldData,
    floors: newFloors,
  }));
};

const handleDragStart = (e, floor) => {
  setDraggedFloor(floor);
  e.dataTransfer.effectAllowed = "move";
};

const handleDragOver = (e, floor) => {
  e.preventDefault();
  setDragOverFloor(floor);
};

const handleDragLeave = () => {
  setDragOverFloor(null);
};

const handleDrop = (e, targetFloor) => {
  e.preventDefault();

  if (draggedFloor && targetFloor && draggedFloor._id !== targetFloor._id) {
    const newFloors = [...floors];

    const draggedIndex = newFloors.findIndex((f) => f._id === draggedFloor._id);
    const targetIndex = newFloors.findIndex((f) => f._id === targetFloor._id);

    const [removedFloor] = newFloors.splice(draggedIndex, 1);

    newFloors.splice(targetIndex, 0, removedFloor);

    updateFloorsOrder(newFloors);
  }

  setDraggedFloor(null);
  setDragOverFloor(null);
};

  return (
    
      <StrictMode>
            <Suspense fallback={<LoadingFallback />}>
      <div className="flex bg-secondary-500">

        {loadingVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[400px] flex flex-col justify-center items-center gap-4 rounded-md shadow-md text-center">
            <Loading />
            <p className="text-xl font-semibold text-base-450">{loadingMessage}</p>
          </div>
        </div>
        )}
        <div
        className={`flex-shrink-0 w-[30%] flex flex-col z-20 justify-between gap-3 min-h-screen border-r transition-transform duration-500 
        ${isSliderOpen ? "translate-x-[0%]" : "-translate-x-[100%]"}`}
        >   
        <div className="h-[100%]">
          <div className="flex justify-end w-[100%]">
          </div>
          <HeaderSection className="" university={university} updatedCampus={updatedCampus} />
          <div className=" flex flex-col gap-3">
            <div className="relative px-6">
            <div className="relative w-full">
            <Input
              placeholder={selectedFloor ? "Search location" : "Select a floor first"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-5 ${!selectedFloor ? "bg-base-450 text-base-450" : ""}`}
              disabled={!selectedFloor}
            />
              {!selectedFloor && (
                <div className="absolute inset-0 bg-base-450 bg-opacity-50 cursor-not-allowed rounded-md" />
              )}
            </div>
            </div>
            <div className="flex justify-between items-center pl-6">
              <p className="text-sm">List of Floors</p>
              <div className="flex gap-3 pr-6">
                {!isEditing ? (
                  <>
                    <button
                      onClick={toggleEditMode}
                      className="h-[40px] w-[80px] px-1 flex justify-end text-secondary-200-70 items-center hover:text-black"
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleEditMode}
                    className="h-[40px] w-[80px] px-1 flex justify-end items-center hover:underline"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center">
            {isEditing && (
              !isRemove && (
                <div className="flex w-[90%] p-4 pl-6 shadow-md rounded-lg mb-4 h-[90px] bg-white">
                  <div className="flex w-[90%] gap-6">
                  <button>
                  <GoAlert className="text-base-350 h-[20px] w-[20px]" />
                  </button>
                  <p className="text-base-350 text-sm flex items-center">
                      Removing a floor map will also erase all <br/> associated featured locations uploaded to that <br/> floor
                  </p>
                  </div>
                  
                  <button onClick={removeAlert} className="w-[10%]  justify-center flex items-center">
                  <MdClose className="text-secondary-200 h-[20px] w-[20px]"/>
                  </button>
                </div>
              )
            )}

          <div className="max-h-[360px] group w-[100%]">
            <div className={`max-h-[360px] pl-6 pr-6 overflow-y-auto ${isRemove ? "max-h-[460px]" : "max-h-[340px]"}`}>
            {floors?.map((floor) => (
              <div key={floor._id} className="flex flex-col justify-between w-[100%]">
                {isEditing ? (
                  <div
                    key={floor._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, floor)}
                    onDragOver={(e) => handleDragOver(e, floor)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, floor)}
                    onClick={() => {
                      toggleFloor(floor._id);
                      handleSelectFloor(floor);
                    }}
                    className={`px-5 pr-3 border h-[60px] cursor-pointer items-center flex justify-between w-[100%] rounded-lg mb-3 ${
                      selectedFloor && selectedFloor._id === floor._id
                        ? "border-black text-black"
                        : dragOverFloor && dragOverFloor._id === floor._id
                        ? "border-blue-500"
                        : "bg-none"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <RxDragHandleDots2 className="text-black h-[30px] w-[30px]" />
                      <h3 className="font-semibold p-2">{floor.floor_name}</h3>
                    </div>
                    <div>
                    <button
                      onClick={() => setEditingFloor(floor)}
                      className="h-[30px] w-[30px]"
                    >
                      <FaPen className="h-[16px] w-[16px] cursor-pointer" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmRemoveFloor(floor);
                      }}
                      className="h-[30px] w-[30px]"
                    >
                      <RiDeleteBin5Fill className="cursor-pointer h-[18px] w-[18px] text-accent-100" />
                    </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        toggleFloor(floor._id);
                        handleSelectFloor(floor);
                      }}
                      className={`px-5 border h-[60px] cursor-pointer items-center flex justify-between w-[100%] rounded-lg mb-3 ${
                        selectedFloor && selectedFloor._id === floor._id
                          ? "border-base-200 text-base-200"
                          : "bg-none"
                      }`}
                    >
                      <h3 className="font-semibold">{floor.floor_name}</h3>
                      <button
                        onClick={() => {
                          toggleFloor(floor._id);
                          handleSelectFloor(floor);
                        }}
                        className="text-md"
                      >
                        {expandedFloor === floor._id ? (
                          <TiArrowSortedUp className="text-base-200" />
                        ) : (
                          <TiArrowSortedDown className="text-secondary-200" />
                        )}
                      </button>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-1000 ease-in-out ${
                        expandedFloor === floor._id ? "max-h-[1000px]" : "max-h-0"
                      }`}
                    >
                      <div className="pl-[50px]">
                      {floor.markers
                      ?.filter(marker => 
                        marker.marker_name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      ?.map((marker) => (
                        <div
                          key={marker._id}
                          className="relative flex-col h-[100%] flex pl-3 items-center group"
                        >
                          <div className="cursor-pointer flex justify-between hover:bg-secondary-200-50 w-[100%] h-[50px] px-3"
                          onClick={() => handleMarkerClicked(marker)}>
                            <p className="text-md flex items-center">{marker.marker_name}</p>
                            <div className="flex gap-2 opacity-0 flex items-center group-hover:opacity-100 transition-opacity duration-300">
                              <FaPen
                                onClick={() => handleMarkerClick(marker)}
                                className="h-[16px] w-[16px] cursor-pointer"
                              />
                              <RiDeleteBin5Fill
                                onClick={() => confirmRemoveMarker(marker)}
                                className="cursor-pointer h-[18px] w-[18px] text-accent-100"
                              />
                            </div>
                          </div>
                        </div>
                    ))}
                      </div>
                      <button
                        onClick={handleAddMarkerClick}
                        className="pl-[60px] w-[100%] cursor-default"
                      >
                        <div className="px-3 hover:border-base-200 font-semibold border border-white h-[50px] text-base-200 cursor-pointer items-center flex w-[100%] gap-4 rounded-lg mb-3">
                          <LuPlus className="h-[30px] w-[30px]" />
                          <p>Add Location</p>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
              </div>
              </div>

              {!isEditing && (
                <div className="px-6 w-[100%] pt-4">
                <button
                  onClick={handleAddFloorClick}
                  className="px-4 border-base-200 font-semibold border h-[60px] text-base-200 cursor-pointer items-center flex w-[100%] gap-4 rounded-lg mb-3"
                >
                  <LuPlus className="h-[30px] w-[30px]"/>
                  <p>Add Floor</p>
                </button>
                </div>
              )}
            </div>
          </div>

        </div>
        <div className="py-5 flex gap-2 px-6">
          <Link
            className="flex justify-center items-center h-[45px] rounded-md px-[50px] w-[50%] text-base-200 hover:bg-secondary-350"
            to="/virtual-tour/build-mode"
          >
            <button>Return View</button>
          </Link>
          <div
            onClick={handleExitBuildMode}
            className="flex justify-center items-center bg-accent-150 text-accent-100 hover:bg-accent-100 hover:text-white h-[45px] gap-2 rounded-md px-[50px] w-[60%] cursor-pointer"
          >
            <FaMapMarkerAlt/>
            <button>Exit Build Mode</button>
          </div>
        </div>
      </div>

        <div
        className={`flex-grow transition-all duration-500 ${
          isSliderOpen ? "ml-[0%]" : "ml-[-30%]"
        }`}
        >
          

          {selectedFloor ? (
            <div className="">
              
              <MapContainer
                center={[14.484750, 121.189000]}
                zoom={18}
                maxZoom={19}
                minZoom={17}
                style={{
                  height: "100vh",
                  width: "100%",
                  backgroundColor: "white",
                  zIndex: 0,
                  cursor: "crosshair"
                }}
                maxBounds={[
                  [14.479, 121.183], // Southwest (bottom-left) boundary
                  [14.490, 121.195], // Northeast (top-right) boundary
                ]}
              >

              {!isRemove && (
                <div className={`absolute flex w-[660px] top-10 left-[350px] z-[1000000] p-4 pl-6 shadow-md rounded-lg mb-4 h-[90px] bg-white transition-opacity transition-transform duration-500 ease-in-out ${isSliderOpen ? "translate-x-[100%] opacity-0" : "translate-x-[0%] bg-opacity-100"}`}>
                  <div className="flex w-[90%] gap-6 items-center">
                    <button>
                    <IoAlertCircle className="text-base-200 h-[45px] w-[45px]"/>
                    </button>
                    <p className="text-base-200 text-sm w-[100%] justify-center">
                      You are now {isAddMarkerModalOpen ? "adding" : "editing"} at <b className="text-[1rem]">{selectedFloor.floor_name}</b> <br /> Pin a location anywhere on the screen to add or edit a featured location
                    </p>
                  </div>
                </div>
              )}
              
                
                <div  className={`absolute flex w-[80px] top-[75px] z-[1000000] p-4 pl-6 mb-4 h-[90px] transition-opacity transition-transform duration-1000 ease-in-out ${isSliderOpen ? "left-[-80px] translate-x-[100%]" : "left-[-5px]  translate-x-[0%]"}`}>
                    <button onClick={() => setHideMarkers((prev) => !prev)} className="text-2xl">
                      {hideMarkers ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                </div>

                <FlyToSelectedMarker selectedMarker={selectedMarker} />
                <FlyToSelectMarker selectMarker={selectMarker} markerRefs={markerRefs}/>

                <ImageOverlay className="z-0" url={selectedFloor.floor_photo_url} bounds={bounds} />
                
                {!hideMarkers &&
                  currentMarkers
                    .filter(marker => marker._id !== selectedMarker?._id)
                    .map((marker, index) => {
                      const categoryToUse = marker._id === "temp_marker"
                        ? selectedCategory
                        : marker.category;

                      const icon = getIcon(categoryToUse, false);

                      return (
                        <Marker
                          key={index}
                          position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
                          icon={icon}
                          ref={(ref) => {
                            if (ref) {
                              markerRefs.current[marker._id] = ref;
                            }
                          }}
                        >
                      {!isAddMarkerModalOpen && (
                        <Popup className="custom-popup" closeButton={false} 
                        eventHandlers={{
                          add: (e) => {
                            setPopupInstance(e.target);
                          },
                        }}>
                        <div className={`p-3 border ${categoryConfig[marker.category]?.borderColor || "border-base-200"} ${categoryConfig[marker.category]?.textColor || "bg-base-200"} rounded-md box-shadow shadow-2xl drop-shadow-2xl flex justify-center items-center bg-white`}>                 
                          <div className="flex gap-3 w-[100%] flex-col h-[100%] justify-around ">
                          <p className={`${categoryConfig[marker.category]?.textColor || "text-base-200"} tracking-wider text-center text-[18px] !my-[0%] font-bold`}>{marker.marker_name}</p>
                          {marker.marker_photo_url && (
                            <button
                              onClick={() => showPanorama(marker)}
                              className={`p-3 rounded-md text-[15px] text-white ${categoryConfig[marker.category]?.color || "bg-base-200"}`}
                            >
                            <Label
                            className={`text-[14px] tracking-wider cursor-pointer`}
                            >
                              PREVIEW
                            </Label>
                            </button>
                          )}
                          </div>
                        </div>
                      </Popup>
                      )}
                      
                      </Marker>
                  );
                })}

                {selectedMarker && (
                  <Marker
                    key={"selected-marker"}
                    position={[
                      parseFloat(selectedMarker.latitude),
                      parseFloat(selectedMarker.longitude),
                    ]}
                    icon={getIcon(selectedMarker.category, true)}
                  >
                    {!isAddMarkerModalOpen && (
                      <Popup className="custom-popup" closeButton={false} >
                       <div className={`p-3 border border-base-450 ${categoryConfig[selectedMarker.category]?.textColor || "bg-base-200"} rounded-md box-shadow shadow-2xl drop-shadow-2xl flex justify-center items-center bg-white`}>                 
                          <div className="flex gap-3 w-[100%] flex-col h-[100%] justify-around ">
                          <p className={`text-base-450 tracking-wider text-center text-[18px] !my-[0%] font-bold`}>{selectedMarker.marker_name}</p>
                          {selectedMarker.marker_photo_url && (
                            <button
                              onClick={() => showPanorama(selectedMarker)}
                              className={`p-3 rounded-md text-[15px] text-white bg-base-450`}
                            >
                            <Label
                            className={`text-[14px] tracking-wider cursor-pointer`}
                            >
                              PREVIEW
                            </Label>
                            </button>
                          )}
                          </div>
                        </div>
                      </Popup>
                    )}
                  </Marker>
                )}

                {!isSliderOpen && <LocationMarker setCoordinates={setCoordinates} />}
              </MapContainer>

              
            </div>
          ) : (
            <div className="flex min-h-screen flex-col gap-6 justify-center items-center">
              <div className="w-[30%] gap-3 flex items-center justify-center">
                <img
                  className="h-[170px]"
                  src={university.university_vector_url || "/default-vector.png"}
                  alt="University vector"
                />
                <img
                  className="h-[170px]"
                  src={university.university_logo_url || "/default-logo.png"}
                  alt="University logo"
                />
              </div>
              <div className="w-[70%] flex flex-col justify-center items-center justify-center">
                <h2 className="font-bold font-cizel-decor text-xl">University Of Rizal SystemUNIVERSITY OF RIZAL SYSTEM</h2>
                <h3 className="text-md font-cizel">NURTURING TOMORROW'S NOBLEST</h3>
              </div>
              { (totalFloors == 0) ? (
                <div className="flex gap-3 p-4 items-center bg-white shadow-md rounded-md">
                  <IoAlertCircle className="text-accent-100 h-[25px] w-[25px]"/>
                  <p className="text-accent-100">No floor has been added. Nothing to display.</p>
                </div>
              ) : (
                <div className="flex gap-3 p-4 items-center bg-white shadow-md rounded-md">
                  <p className="text-base-200">Click a floor to display.</p>
                </div>
              )}
              <div>

              </div>
            </div>
          )}
        </div>

        {isPanorama &&  (
        <div className="bg-black absolute z-50 flex justify-center items-center w-[100%] h-[100%] top-0 left-0 bg-opacity-60">
          <div ref={modalRef} className="relative">
            <PreviewPanorama imageUrl={previewImage} 
            markerDescription={markerDescription} 
            markerName={markerName} 
            markerCategory={markerCategory} 
            categoryConfig={categoryConfig}  
            />
          </div>
        </div>
        )}
      
        {isModalOpen && (
          <AddFloorModal 
          updatedCampus={updatedCampus}
          closeModal={closeModal} 
          campusId={campus._id} 
          refreshFloors={refreshFloors} 
          />
        )}

      {editingFloor && (
        <EditFloorModal
          closeModal={() => setEditingFloor(null)}
          campusId={campus._id}
          floorData={editingFloor}
          refreshFloors={refreshFloors}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          updatedCampus={updatedCampus}
        />
      )}

        <ConfirmationDialog
          isOpen={isDialogOpen}
          onCancel={handleCancelRemove}
          onProceed={handleProceedRemove}
        />

        <DeleteMarkerConfirmationDialog
          isOpen={isMarkerDialogOpen}
          onCancel={handleCancelRemoveMarker}
          onProceed={handleProceedRemoveMarker}
        />

        {selectedMarker && (
          <EditMarkerModal
            className="w-[600px]"
            coordinates={coordinates}
            marker={selectedMarker}
            campusId={campus._id}
            floorId={selectedFloor._id}
            onClose={handleCloseEditMarkerModal}
            refreshMarkers={refreshMarkers}
            hideMarkers={revertMarkers}
            updatedCampus={updatedCampus}
            selectedCategory={selectedMarker?.category || ""} // ✅ Pass category when editing
            setSelectedCategory={setSelectedCategory}
            categoryConfig={categoryConfig}  
          />
        )}

            {isAddMarkerModalOpen && (
              <AddMarkerModal
                className={`w-[600px] ${isAddMarkerModalOpen ? "translate-x-[110%]" : "-translate-x-[100%]"}`}
                coordinates={coordinates}
                selectedFloor={selectedFloor}
                campusId={campus._id}
                closeModal={handleCloseModal}
                hideMarkers={revertMarkers}
                updatedCampus={updatedCampus}
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory}
                categoryConfig={categoryConfig}  
              />
            )}
      </div>
            </Suspense>
</StrictMode>
  );
};


export default EditMode;