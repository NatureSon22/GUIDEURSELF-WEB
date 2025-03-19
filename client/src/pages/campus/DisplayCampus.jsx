import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";
import FeaturePermission from "@/layer/FeaturePermission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPen } from "react-icons/fa6";
import { RiAddLargeFill } from "react-icons/ri";
import "@/fluttermap.css";

// Fix for default marker icon not showing  
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
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

const DisplayCampus = () => {
  const [mapCenter, setMapCenter] = useState([14.46644, 121.22608]); // Default center position
  const [searchTerm, setSearchTerm] = useState("");
  const [key, setKey] = useState(0); // Force re-render
  const navigate = useNavigate();
  const [mapZoom, setMapZoom] = useState(11); // Default zoom level

  const handleNavigate = (path) => {
    navigate(path);
  };

  const { data: campuses = [], isLoading, isError } = useQuery({
    queryKey: ["campuses"],
    queryFn: fetchCampuses,
  });

  const { data: university } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  const updateMapCenter = (newCenter) => {
    setMapCenter(newCenter);
    setKey((prevKey) => prevKey + 1); // Forces re-render
  };

  const updateMapView = (newCenter, newZoom = 15) => {
    setMapCenter(newCenter);
    setMapZoom(newZoom); // Adjust zoom level when searching
    setKey((prevKey) => prevKey + 1); // Forces re-render
  };

  // Function to update the map center based on the searched campus
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase().trim();
    setSearchTerm(term);
  
    const foundCampus = campuses.find((campus) => 
      campus.campus_name.toLowerCase() === term
    );
  
    if (foundCampus && foundCampus.latitude && foundCampus.longitude) {
      updateMapView([parseFloat(foundCampus.latitude), parseFloat(foundCampus.longitude)], 17);
    }
  };

  if (isLoading) {
    return <Skeleton className="w-[240px] rounded-md bg-secondary-200/40 py-24" />;
  }

  if (isError) {
    return <div>Error fetching campuses</div>;
  }

  return (
    <div className="w-full flex">
      {/* Left Container */}
      <div className="w-[75%] flex flex-col gap-6">
        <Header
          title={"Manage Campus"}
          subtitle={"See list of all campuses to manage and edit."}
        />

        {/* Search and Buttons */}
        <div className="w-full pt-6 flex gap-4">
          <Input
            placeholder="Search Campus"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <FeaturePermission module="Manage Campus" access="add campus">
            <Button 
              variant="outline"
              className="text-secondary-100-75"
              onClick={() => handleNavigate("/campus/add")}
            >
              <RiAddLargeFill /> Add Campus
            </Button>
          </FeaturePermission>

          <Button
            variant="outline"
            className="text-secondary-100-75"
            onClick={() => handleNavigate("/campus/edit-campus")}
          >
            <FaPen /> Edit
          </Button>
        </div>

        {/* Map Section */}
        <div className="h-[700px] flex flex-col gap-5">
          <div className="border border-gray-300 rounded-md">
            <div className="p-4">
              <h2 className="font-bold font-cizel-decor">
                University Of Rizal System - Campus Map
              </h2>
            </div>
            <MapContainer
              key={key} // Forces re-render when state updates
              center={mapCenter}
              zoom={mapZoom} // Dynamically update zoom level
              className="h-[530px] w-[100%] outline-none border border-gray-300"
              scrollWheelZoom={false}
            >
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {campuses.map((campus, index) => (
                <Marker
                  key={index}
                  position={[parseFloat(campus.latitude), parseFloat(campus.longitude)]}
                >
                  <Popup>
                    <strong>{campus.campus_name}</strong>
                    <br />
                    {campus.campus_address}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

          </div>
        </div>
      </div>

      {/* Right Container */}
      <div className="w-[40%] pl-6 py-2 flex flex-col gap-4">
        <div className="border px-2 w-[100%] h-[100px] flex justify-between rounded-md">
          <div className="w-[30%] gap-3 flex items-center justify-center">
            <img className="h-[60px]" src={university?.university_vector_url} alt="" />
            <img className="h-[60px]" src={university?.university_logo_url} alt="" />
          </div>
          <div className="w-[70%] flex flex-col justify-center">
            <h2 className="font-bold text-lg font-cizel-decor">UNIVERSITY OF RIZAL SYSTEM</h2>
            <h3 className="text-sm font-cizel">NURTURING TOMORROW'S NOBLEST</h3>
          </div>
        </div>

        <p className="text-sm">List of Campuses</p>
        <div className="border-t border-x">
          {/* Render campus names */}
          {campuses.map((campus, index) => (
            <div key={index} className="py-4 border-b border-gray-300">
              <p className="text-center font-cizel">{campus.campus_name} Campus</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};  

export default DisplayCampus;
