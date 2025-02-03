import "leaflet/dist/leaflet.css";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";
import AddFloorModal from "./AddFloorModal";
import HeaderSection from "./HeaderSection";
import { MapContainer, ImageOverlay, Marker, useMapEvents, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet"; 
import AddMarkerModal from "./AddMarkerModal";
import ConfirmationDialog from "./ConfirmationDialog";
import DeleteMarkerConfirmationDialog from "./DeleteMarkerConfirmationDialog"
import EditMarkerModal from "./EditMarkerModal";
import { GoAlert } from "react-icons/go";
import { MdClose } from "react-icons/md";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { LuPlus } from "react-icons/lu";
import { FaPen } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { renderToString } from "react-dom/server";
import { BsDoorOpenFill } from "react-icons/bs";
import { PiOfficeChairFill } from "react-icons/pi";
import { FaGraduationCap } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { ImManWoman } from "react-icons/im";  
import { renderToStaticMarkup } from "react-dom/server";
import { HiSquaresPlus } from "react-icons/hi2";
import { loggedInUser } from "@/api/auth";

const categoryConfig = {
  "Academic Spaces": { color: "bg-yellow-500", padding: "pl-[1px]", icon: BsDoorOpenFill },
  "Administrative Offices": { color: "bg-red-500", icon: PiOfficeChairFill },
  "Student Services": { color: "bg-blue-500", icon: FaGraduationCap },
  "Campus Attraction": { color: "bg-green-500", icon: FaFlag },
  "Utility Areas": { color: "bg-pink-500", icon: ImManWoman },
  "Others (Miscellaneous)": { color: "bg-blue-400", icon: HiSquaresPlus },
};

// Reusable Marker Component
const MarkerIcon = ({ bgColor, IconComponent }) => (
  <div className={`flex items-center justify-center w-[45px] h-[45px] rounded-full pl-[2px] ${bgColor}`}>
    <IconComponent color="white" size={25} className="" />
  </div>
);

const iconSvg = renderToStaticMarkup(<FaMapMarkerAlt size={38} className="text-base-200" />);
const iconUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`;

// Convert React component to Leaflet divIcon
const createIcon = (category) => {
  const { color, icon: IconComponent } = categoryConfig[category] || {}; // Get config or undefined
  if (!IconComponent) return defaultIcon; // Return default if category not found

  const iconString = renderToString(<MarkerIcon bgColor={color} IconComponent={IconComponent} />);

  return L.divIcon({
    html: iconString,
    className: "custom-marker",
    iconSize: [35, 35],
    iconAnchor: [25, 20], // Adjust for centering
  });
};

// Generate only when needed
const customIcons = new Proxy({}, {
  get: (target, category) => target[category] || (target[category] = createIcon(category))
});

// Default marker icon
const defaultIcon = L.icon({
  iconUrl,
  iconSize: [38, 39],
  iconAnchor: [20, 20],
});

const fetchCampusData = async (campusId) => {

  const response = await fetch(`http://localhost:3000/api/campuses/${campusId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch campus data");
  }

  const data = await response.json();

  // Ensure each floor has a markers array initialized
  data.floors.forEach((floor) => {
    if (!floor.markers) {
      floor.markers = []; // Initialize markers if not present
    }
  });

  return data;
};

const EditMode = () => {
  const location = useLocation();
const navigate = useNavigate();
const queryClient = useQueryClient();

const { campus } = location.state || {};

const [selectedFloor, setSelectedFloor] = useState(null);
const [selectedMarker, setSelectedMarker] = useState(null);
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
const [expandedFloor, setExpandedFloor] = useState(null);
const [isSliderOpen, setIsSliderOpen] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const [loadingMessage, setLoadingMessage] = useState("");
const toggleSlider = () => {
  setIsSliderOpen(!isSliderOpen);
};

  const { data, isLoading } = useQuery({
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
  toggleSlider();
};

const handleCloseEditMarkerModal = () => {
  setSelectedMarker(null);
  setIsSliderOpen(true);
  setIsRemove(false);
};

const handleSelectFloor = (floor) => {
  setSelectedFloor(floor);
  setCoordinates({ lat: null, lng: null });
};

const fetchMarkers = async () => {
  if (!selectedFloor) return [];
  try {
    const response = await fetch(
      `http://localhost:3000/api/campuses/floors/${selectedFloor._id}/markers`,
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
  setIsRemove(false);
  setCoordinates({ lat: null, lng: null });
};

const handleExitEditModal = () => {
  setCoordinates({ lat: null, lng: null });
  setIsRemove(false);
};

const { data: university } = useQuery({
  queryKey: ["universitysettings"],
  queryFn: getUniversityData,
});

const { data: updatedCampus } = useQuery({
  queryKey: ["campuses", campus?._id],
  queryFn: () => fetchCampusData(campus._id),
  enabled: !!campus, // Ensure query runs only when campus exists
  initialData: campus,
});

if (!university) return <div>Loading...</div>;
if (!updatedCampus) return <p>No campus data provided. Please select a campus first.</p>;

const handleAddFloorClick = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);
const refreshFloors = () => queryClient.invalidateQueries(["campuses", campus._id]);

const LocationMarker = () => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });
    },
  });

  return coordinates.lat ? (
    <Marker 
    position={[coordinates.lat, coordinates.lng]}
    icon={defaultIcon}>
    </Marker>
  ) : null;
};

const handleAddMarkerClick = () => {
  setAddMarkerModalOpen(true);
  toggleSlider();
};

const toggleEditMode = async () => {
  if (isEditing) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/campuses/${campus._id}/floors`,
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

const confirmRemoveFloor = (floorId) => {
  setFloorToRemove(floorId);
  setIsDialogOpen(true);
};

const handleCancelRemove = () => {
  setIsDialogOpen(false);
  setFloorToRemove(null);
};

const handleProceedRemove = async () => {
  if (floorToRemove) {
    try {
      // Step 1: Find the floor to archive
      const floorToArchive = updatedCampus.floors.find(
        (floor) => floor._id === floorToRemove
      );

      if (!floorToArchive) {
        console.error("Floor not found");
        return;
      }

      // Step 2: Call the backend route to archive the floor
      const response = await fetch(
        `http://localhost:3000/api/campuses/${campus._id}/floors/${floorToRemove}/archive`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            type: "floor", // Set the type to "floor"
            floor_data: floorToArchive, // Pass the floor data
            campus_id: campus._id, // Pass the campus ID
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to archive floor");

      // Step 3: Update the UI to remove the archived floor
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
      // Step 1: Call the backend route to archive the marker
      const response = await fetch(
        `http://localhost:3000/api/campuses/${campus._id}/floors/${selectedFloor._id}/markers/${markerToRemove._id}/archive`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            type: "location", // Set the type to "location"
            location_data: markerToRemove, // Pass the marker data
            campus_id: campus._id, // Pass the campus ID
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to archive marker");

      // Step 2: Log the archiving activity
      const logResponse = await fetch("http://localhost:3000/api/virtualtourlogs", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campus_name: campus.campus_name || "Unknown Campus",
          activity: `Archived a location ${markerToRemove.marker_name}`,
          updated_by: data?.username || "Unknown User",
        }),
      });

      if (!logResponse.ok) {
        console.error("Failed to log archiving activity:", logResponse.statusText);
      }

      console.log(`Marker with ID ${markerToRemove._id} archived successfully.`);

      // Step 3: Update the UI to remove the archived marker
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

const filteredFloors = floors?.filter((floor) =>
  floor.floor_name.toLowerCase().includes(searchQuery.toLowerCase())
);
 
  return (
      <div className="flex bg-secondary-500">

        {loadingVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
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
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-5" // Adjust padding for icon
              />
              <CiSearch className="absolute right-10 top-2 text-lg text-gray-500" />
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
              {filteredFloors?.map((floor) => (
                <div key={floor._id} className="flex flex-col justify-between w-[100%]">
                    {isEditing ? (
                      <>
                        <div
                        onClick={() => {
                          toggleFloor(floor._id);
                          handleSelectFloor(floor);
                        }} 
                        className={`px-5 pr-3 border h-[60px] cursor-pointer items-center flex justify-between w-[100%] rounded-lg mb-3 ${
                            selectedFloor && selectedFloor._id === floor._id
                              ? "border-black text-black"
                              : "bg-none"
                          }`}>
                          <div className="flex items-center gap-2">
                            <RxDragHandleDots2 className="text-black h-[30px] w-[30px]"/>
                            <h3 className="font-semibold p-2">{floor.floor_name}</h3>
                          </div>
                          <button
                            onClick={() => confirmRemoveFloor(floor._id)}
                            className="h-[30px] w-[30px]"
                          >
                            <RiDeleteBin5Fill className="cursor-pointer h-[18px] w-[18px] text-accent-100" />
                          </button>
                        </div>
                      </>
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
                          <h3
                            className="font-semibold"
                          >
                            {floor.floor_name}
                          </h3>
                          <button
                            onClick={() => {
                              toggleFloor(floor._id);
                              handleSelectFloor(floor);
                            }}
                            className="text-md"
                          >
                            {expandedFloor === floor._id ? <TiArrowSortedUp className="text-base-200"/> : <TiArrowSortedDown className="text-secondary-200" />}
                          </button>
                        </div>

                        <div
                          className={`overflow-hidden transition-all duration-1000 ease-in-out ${
                            expandedFloor === floor._id ? "max-h-[1000px]" : "max-h-0"
                          }`}
                        >
                          <div className="pl-[50px]">
                          {floor.markers?.map((marker) => (
                            <div
                              key={marker._id}
                              className="relative flex-col h-[100%] flex pl-3 items-center group"
                            >
                              <div className="flex justify-between hover:bg-secondary-200-50 w-[100%] h-[50px] px-3">
                                <p className="text-md flex items-center">{marker.marker_name}</p>
                                <div className="flex gap-2 opacity-0 flex items-center group-hover:opacity-100 transition-opacity duration-300">
                                  <FaPen onClick={() => handleMarkerClick(marker)} className="h-[16px] w-[16px] cursor-pointer" />
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
                                <LuPlus  className="h-[30px] w-[30px]"/>
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

              {/* Add Floor Button only in non-editing mode */}
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

      {/* Main Content */}
        <div
        className={`flex-grow transition-all duration-500 ${
          isSliderOpen ? "ml-[0%]" : "ml-[-30%]"
        }`}
        >

          {selectedFloor ? (
            <div className="">
              {!isRemove && (
                <div className={`absolute flex w-[600px] top-10 left-[350px] z-50 p-4 pl-6 shadow-md rounded-lg mb-4 h-[90px] bg-blue-200 transition-opacity transition-transform duration-500 ease-in-out ${isSliderOpen ? "translate-x-[100%] opacity-0" : "translate-x-[0%] bg-opacity-70"}`}>
                  <div className="flex w-[90%] gap-6 items-center">
                    <button>
                    <IoAlertCircle className="text-base-200 h-[25px] w-[25px]"/>
                    </button>
                    <p className="text-base-200 text-sm w-[100%] justify-center">
                      You are adding at <b className="text-[1rem]">{selectedFloor.floor_name}</b> <br /> Pin a location anywhere on the screen to add a featured location
                    </p>
                  </div>

                  <button onClick={removeAlert} className="w-[10%] justify-end flex items-center">
                    <MdClose className="text-secondary-200 h-[20px] w-[20px]" />
                  </button>
                </div>
              )}
              <MapContainer
                bounds={[
                  [110, 110],
                  [1000, 1000],
                ]}
                maxZoom={4}
                style={{
                  height: "100vh",
                  width: "100%",
                  backgroundColor: "white",
                  zIndex: 0,
                }}
                crs={L.CRS.Simple}
                zoomControl={false}
                attributionControl={false}
              >
                <ImageOverlay
                  className="z-0"
                  url={selectedFloor.floor_photo_url}
                  bounds={[
                    [110, 110],
                    [1000, 1000],
                  ]}
                />
                
                {currentMarkers.map((marker, index) => {
                  // Get the icon based on the marker's category
                  const icon = customIcons[marker.category] || defaultIcon;
                  const categoryColor = categoryConfig[marker.category]?.color || "bg-green"; // Default to green if category not found

                  return (
                    <Marker
                      key={index}
                      position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
                      icon={icon} // Assign the custom icon
                    >
                      <Popup>
                        <div>
                          <strong>{marker.marker_name}</strong>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                <LocationMarker setCoordinates={setCoordinates} />
              </MapContainer>
              
            </div>
          ) : (
            <div className="flex min-h-screen flex-col gap-6 justify-center items-center">
              <div className="w-[30%] flex items-center justify-center">
                <img
                  className="h-[100%]"
                  src={university.university_vector_url || "/default-vector.png"}
                  alt="University vector"
                />
                <img
                  className="h-[100%]"
                  src={university.university_logo_url || "/default-logo.png"}
                  alt="University logo"
                />
              </div>
              <div className="w-[70%] flex flex-col justify-center items-center justify-center">
                <h2 className="font-bold text-xl">UNIVERSITY OF RIZAL SYSTEM</h2>
                <h3 className="text-md">NURTURING TOMORROW'S NOBLEST</h3>
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
      
        {isModalOpen && (
          <AddFloorModal closeModal={closeModal} campusId={campus._id} refreshFloors={refreshFloors} />
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
            exitModal={handleExitEditModal}
            refreshMarkers={refreshMarkers}
            updatedCampus={updatedCampus}
          />
        )}

            {isAddMarkerModalOpen && (
              <AddMarkerModal
                className={`w-[600px] ${isAddMarkerModalOpen ? "translate-x-[110%]" : "-translate-x-[100%]"}`}
                coordinates={coordinates}
                selectedFloor={selectedFloor}
                campusId={campus._id}
                closeModal={handleCloseModal}
                updatedCampus={updatedCampus}
              />
            )}
      </div>
  );
};

export default EditMode;
