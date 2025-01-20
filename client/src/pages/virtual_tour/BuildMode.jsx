import React, { useState } from "react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import WorldMap from "./WorldMap";
import CampusCard from "./CampusCard";
import SlideBar from "./SlideBar";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BuildMode = () => {
  const [position] = useState([14.46644, 121.22608]);
  const [selectedCampus, setSelectedCampus] = useState(null);

  const handleCampusSelect = (campus) => {
    setSelectedCampus(campus); // Update state with the selected campus
  };

  const closeModal = () => {
    setSelectedCampus(null);
  };

  return (
    <div className="flex min-h-screen">
      <SlideBar onCampusSelect={handleCampusSelect} />
      <WorldMap />
      {selectedCampus && (
        <CampusCard campus={selectedCampus} onClose={closeModal} />
      )}
    </div>
  );
};

export default BuildMode;
