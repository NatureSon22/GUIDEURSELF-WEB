import React, { useState, useRef, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Skeleton } from "@/components/ui/skeleton";
import CampusCard from "./CampusCard";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import "@/fluttermap.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const iconSvg = renderToStaticMarkup(
  <FaMapMarkerAlt size={50} color="#12A5BC" />
);
const iconUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`;

const defaultIcon = L.icon({
  iconUrl,
  iconSize: [35, 45],
  iconAnchor: [15, 40],
});

const fetchCampuses = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch campuses");
  }
  return response.json();
};

const MapEffect = ({ campus, markerRefs }) => {
  const map = useMap();

  useEffect(() => {
    if (campus && markerRefs.current[campus._id]) {
      const marker = markerRefs.current[campus._id];
      const lat = parseFloat(campus.latitude);
      const lng = parseFloat(campus.longitude);
  
      // Add a tiny offset to "force" the map to think it's a new view
      const offsetLat = lat + Math.random() * 0.000001;
  
      map.flyTo([lat, lng], 17, { animate: true, duration: 3 });
      setTimeout(() => marker.openPopup(), 300); // wait for pan to complete
    }
  }, [campus]);
  
  

  return null;
};


const WorldMap = ({ campus, onClose }) => {
  const [position] = useState([14.46644, 121.22608]);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupInstance, setPopupInstance] = useState(null);
  const markerRefs = useRef({});

  const { data: campuses = [], isLoading, isError } = useQuery({
    queryKey: ["campuses"],
    queryFn: fetchCampuses,
  });

  if (isLoading) 
      return <Skeleton className="rounded-md mt-4 bg-secondary-200/40 py-24" />;

  const filteredCampuses = campuses.filter((campus) =>
    campus.campus_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClosePopup = () => {
    if (popupInstance) {
      popupInstance.remove();
    }
  };

  return (
    <MapContainer
      center={position}
      zoom={12}
      scrollWheelZoom={false}
      className="h-[100vh] w-[100%] z-[10] outline-none border border-gray-300"
    >
      <TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
  
      {/* Only render MapEffect once campuses are ready */}
      <MapEffect campus={campus} markerRefs={markerRefs} />
  
      {filteredCampuses
        .filter(
          (campus) =>
            campus.latitude &&
            campus.longitude &&
            !isNaN(parseFloat(campus.latitude)) &&
            !isNaN(parseFloat(campus.longitude))
        )
        .map((campus, index) => (
          <Marker
            key={index}
            position={[
              parseFloat(campus.latitude),
              parseFloat(campus.longitude),
            ]}
            icon={defaultIcon}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[campus._id] = ref;
              }
            }}
          >
            <Popup
              className="custom-popup !right-[-300px]"
              closeButton={true}
              eventHandlers={{
                add: (e) => {
                  setPopupInstance(e.target);
                },
              }}
            >
              <CampusCard campus={campus} closePopup={handleClosePopup} />
            </Popup>
          </Marker>

        ))}
    </MapContainer>
  );
};

export default WorldMap;
