import React, { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import "@/fluttermap.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const iconSvg = renderToStaticMarkup(<FaMapMarkerAlt size={50} color="#12A5BC"/>);
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

const WorldMap = () => {
    const [position] = useState([14.46644, 121.22608]);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: campuses = [], isLoading, isError } = useQuery({
      queryKey: ["campuses"],
      queryFn: fetchCampuses,
    });

    const filteredCampuses = campuses.filter((campus) =>
        campus.campus_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

return (
    <MapContainer
    center={position}
    zoom={12}
    scrollWheelZoom={false}
    className="h-[100vh] w-[100%] z-[10] outline-none border border-gray-300"
  >
    <TileLayer
      url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`}
    />

    {/* Render filtered markers */}
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
        >
                  <Popup className="custom-popup" closeButton={false}>
                  <div className="px-3  box-shadow shadow-2xl drop-shadow-2xl rounded-md flex justify-center items-center bg-white text-black border border-black">
                    <p className="text-[16px] text-center font-bold">
                        {campus.campus_name}
                    </p>
                  </div>
                  </Popup>
        </Marker>
      ))}
  </MapContainer>
)
}

export default WorldMap;