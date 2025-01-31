import React, { useState } from "react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const fetchCampuses = async () => {
    const response = await fetch("http://localhost:3000/api/campuses", {
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
    zoom={11}
    className="min-h-screen w-[100%] z-[10] outline-none border border-gray-300"
    zoomControl={false}
    attributionControl={false}
  >
    <TileLayer
      url={`https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=c5319e635a224bbe8fd69f82a629bd97`}
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
        >
          <Popup>
            <strong>{campus.campus_name}</strong>
            <br />
            {campus.campus_address}
          </Popup>
        </Marker>
      ))}
  </MapContainer>
)


}

export default WorldMap;