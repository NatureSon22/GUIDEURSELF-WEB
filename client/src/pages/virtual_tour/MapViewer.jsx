// import { MapContainer, ImageOverlay, Marker, useMapEvents, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { useState, useEffect } from "react";
// import { getUniversityData } from "@/api/component-info";
// import { useQuery } from "@tanstack/react-query";
// import L from "leaflet"; // Import Leaflet to use L.CRS.Simple
// import AddMarkerModal from "./AddMarkerModal";

// const MapViewer = ({ selectedFloor, campusId, handleAddMarker }) => {
  
//   const [position, setPosition] = useState([14.466440, 121.226080]); 
//   const [coordinates, setCoordinates] = useState({ lat: "0", lng: "0" });
//   const [currentMarkers, setCurrentMarkers] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);  

//   const { data: university } = useQuery({
//     queryKey: ["universitysettings"],
//     queryFn: getUniversityData,
//   });

//   useEffect(() => {
//     if (selectedFloor) {
//       setCurrentMarkers(selectedFloor.markers || []);
//       setCoordinates({ lat: null, lng: null });
//     } else {
//       setCurrentMarkers([]);
//       setCoordinates({ lat: null, lng: null });
//     }
//   }, [selectedFloor]);

//   if (!university) {
//     return <div>Loading...</div>;
//   }

//   const LocationMarker = () => {
//     const map = useMapEvents({
//       click(e) {
//         const { lat, lng } = e.latlng;
//         setCoordinates({ lat, lng });
//         console.log("Coordinates:", lat, lng);
//         setModalOpen(true);
//       },
//     });

//     return coordinates.lat ? (
//       <Marker position={[coordinates.lat, coordinates.lng]}>
//         <Popup>
//           Selected Location: <br /> Latitude: {coordinates.lat} <br /> Longitude: {coordinates.lng}
//         </Popup>
//       </Marker>
//     ) : null;
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setCoordinates({ lat: null, lng: null });
//   };

// // Inside handleAddNewMarker (or similar)
// const handleAddNewMarker = (newMarker) => {
//   if (selectedFloor !== null) {
//     handleAddMarker(selectedFloor, newMarker); // Ensure selectedFloor is being passed correctly
//   } else {
//     console.error("No floor selected to add a marker.");
//   }
// };


//   return selectedFloor ? (
//     <div>
//       <MapContainer
//         center={position}
//         maxZoom={11}
//         style={{
//           height: "100vh",
//           width: "100%",
//           backgroundColor: "white",
//           zIndex: 0,
//         }}
//         crs={L.CRS.Simple}
//       >
//         <ImageOverlay
//           className="z-10"
//           url={selectedFloor.floor_photo_url}
//           bounds={[
//             [110, 110],
//             [1000, 1000],
//           ]}
//         />

//         {currentMarkers
//           .filter(marker => 
//             marker.latitude && 
//             marker.longitude && 
//             !isNaN(parseFloat(marker.latitude)) && 
//             !isNaN(parseFloat(marker.longitude))
//           )
//             .map((marker, index) => (
//               <Marker
//                 key={index}
//                 position={[
//                   parseFloat(marker.latitude), 
//                   parseFloat(marker.longitude)
//                 ]}
//               >
//               <Popup>
//                 <strong>{marker.marker_name} Campus</strong><br />
//                 {marker.marker_description}
//               </Popup>
//               </Marker>
//               ))
//         }
//         <LocationMarker />
//       </MapContainer>
//       {isModalOpen && (
//         <AddMarkerModal
//           coordinates={coordinates}
//           selectedFloor={selectedFloor}
//           campusId={campusId}
//           closeModal={handleCloseModal}
//           handleAddNewMarker={handleAddNewMarker} // Pass the function to handle adding the new marker
//         />
//       )}
//     </div>
//   ) : (
//     <div className="flex min-h-screen flex-col gap-6 justify-center items-center">
//       <div className="w-[30%] flex items-center justify-center">
//         <img
//           className="h-[100%]"
//           src={university.university_vector_url || "/default-vector.png"}
//           alt="University vector"
//         />
//         <img
//           className="h-[100%]"
//           src={university.university_logo_url || "/default-logo.png"}
//           alt="University logo"
//         />
//       </div>
//       <div className="w-[70%] flex flex-col justify-center items-center justify-center">
//         <h2 className="font-bold text-xl">UNIVERSITY OF RIZAL SYSTEM</h2>
//         <h3 className="text-md">NURTURING TOMORROW'S NOBLEST</h3>
//       </div>
//     </div>
//   );
// };

// export default MapViewer;
