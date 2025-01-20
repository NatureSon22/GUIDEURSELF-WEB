import { Outlet, Link } from "react-router-dom";
import Header from "@/components/Header";
import React, { useState } from "react";
import Pen from "../../assets/Pen.png";
import addImage from "../../assets/add.png";
import Search from "../../assets/Search.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";

// Fix for default marker icon not showing  
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

const DisplayCampus = () => {
  const [position] = useState([14.46644, 121.22608]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: campuses = [], isLoading, isError } = useQuery({
    queryKey: ["campuses"],
    queryFn: fetchCampuses,
  });

  const { data: university } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  // Filter campuses based on search term
  const filteredCampuses = campuses.filter((campus) =>
    campus.campus_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching campuses</div>;
  }

  return (
    <div className="w-full flex w-[100%]">
      {/* Left Container */}
      <div className="w-[75%] flex flex-col justify-between">
        <Header
          title={"Manage Campus"}
          subtitle={"See list of all campuses to manage and edit."}
        />

        {/* Search and Buttons */}
        <div className="w-full pt-6 flex gap-4">
          <div className="w-[75%] h-[40px] flex flex-row justify-between items-center py-1 px-2 rounded-md border-gray-300 border">
            <textarea
              className="overflow-hidden w-[100%] h-5 resize-none outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img className="h-[100%]" src={Search} alt="" />
          </div>

          <Link to="/campus/add" className="w-[20%]">
            <button className="w-[100%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300">
              <img
                className="w-[30px] h-[30px]"
                src={addImage}
                alt="Add Officials"
              />
              Add Campus
            </button>
          </Link>

          <Link to="/campus/edit" className="w-[10%]">
            <button className="w-[100%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300">
              <img className="w-[17px] h-[17px]" src={Pen} alt="Add Officials" />
              Edit
            </button>
          </Link>
        </div>

        {/* Map Section */}
        <div className="h-[700px] py-6 flex flex-col gap-5">
          <div className="border border-gray-300 rounded-md">
            <div className="p-4">
              <h2 className="font-bold italic">
                University Of Rizal System - Campus Map
              </h2>
            </div>
            <MapContainer
              center={position}
              zoom={11}
              className="h-[530px] w-[100%] outline-none border border-gray-300"
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
          </div>
        </div>
      </div>

      {/* Right Container */}
      <div className="w-[40%] pl-6  py-2 flex flex-col gap-4">
        <div className="border px-2 w-[100%] h-[100px] flex justify-between rounded-md">
          <div className="w-[30%] flex items-center justify-center">
            <img className="h-[45%]" src={university?.university_vector_url} alt="" />
            <img className="h-[45%]" src={university?.university_logo_url} alt="" />
          </div>
          <div className="w-[70%] flex flex-col justify-center">
            <h2 className="font-bold text-lg">UNIVERSITY OF RIZAL SYSTEM</h2>
            <h3 className="text-sm">NURTURING TOMORROW'S NOBLEST</h3>
          </div>
        </div>

        <p className="text-sm">List of Campuses</p>
        <div className="border-t border-x">
          {/* Render filtered campus names */}
          {filteredCampuses.map((campus, index) => (
            <div key={index} className="py-4 border-b border-gray-300">
              <p className="text-center">{campus.campus_name} Campus</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayCampus;
