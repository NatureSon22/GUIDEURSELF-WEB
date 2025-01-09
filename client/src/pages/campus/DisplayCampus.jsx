import { Outlet, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Pen from "../../assets/Pen.png";
import addImage from "../../assets/add.png";
import Search from "../../assets/Search.png";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import UrsVector from "../../assets/UrsVector.png";
import UrsLogo from "../../assets/UrsLogo.png";
import Header from "@/components/Header";

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DisplayCampus = () => {
  const [position, setPosition] = useState([14.46644, 121.22608]);
  const [campuses, setCampuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/campuses", {
          method: "get",
          credentials: "include",
        });
        const data = await response.json();
        setCampuses(data); // Store fetched campuses
      } catch (error) {
        console.error("Error fetching campuses:", error);
      }
    };

    fetchCampuses();
  }, []);

  // Filter campuses based on search term
  const filteredCampuses = campuses.filter((campus) =>
    campus.campus_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex w-full">
      {/* Left Container */}
      <div className="flex w-[75%] flex-col justify-between pl-6">
        <Header
          title="Manage Campus"
          subtitle="See list of all campuses to manage and edit."
        />

        {/* Search and Buttons */}
        <div className="flex w-full gap-4 pt-6">
          <div className="flex h-[40px] w-[75%] flex-row items-center justify-between rounded-md border border-gray-300 px-2 py-1">
            <textarea
              className="h-5 w-[100%] resize-none overflow-hidden outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
            <img className="h-[100%]" src={Search} alt="" />
          </div>

          <Link to="/campus/add" className="w-[20%]">
            <button className="text-md focus-none flex h-10 w-[100%] items-center justify-evenly rounded-md border-[1.5px] border-gray-400 text-gray-800 outline-none transition duration-300 hover:bg-gray-200">
              <img
                className="h-[30px] w-[30px]"
                src={addImage}
                alt="Add Officials"
              />
              Add Campus
            </button>
          </Link>

          <Link to="/campus/edit" className="w-[10%]">
            <button className="text-md focus-none flex h-10 w-[100%] items-center justify-evenly rounded-md border-[1.5px] border-gray-400 text-gray-800 outline-none transition duration-300 hover:bg-gray-200">
              <img
                className="h-[17px] w-[17px]"
                src={Pen}
                alt="Add Officials"
              />
              Edit
            </button>
          </Link>
        </div>

        {/* Map Section */}
        <div className="flex h-[700px] flex-col gap-5 py-6">
          <div className="rounded-md border border-gray-300">
            <div className="p-4">
              <h2 className="font-bold italic">
                University Of Rizal System - Campus Map
              </h2>
            </div>
            <MapContainer
              center={position}
              zoom={11}
              className="h-[530px] w-[100%] border border-gray-300 outline-none"
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
                    !isNaN(parseFloat(campus.longitude)),
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
      <div className="flex w-[40%] flex-col gap-4 p-6">
        <div className="flex h-[100px] w-[100%] justify-between rounded-md border px-2">
          <div className="flex w-[30%] items-center justify-center">
            <img className="h-[45%]" src={UrsVector} alt="" />
            <img className="h-[45%]" src={UrsLogo} alt="" />
          </div>
          <div className="flex w-[70%] flex-col justify-center">
            <h2 className="text-lg font-bold">UNIVERSITY OF RIZAL SYSTEM</h2>
            <h3 className="text-sm">NURTURING TOMORROW'S NOBLEST</h3>
          </div>
        </div>

        <p className="text-sm">List of Campuses</p>
        <div className="border-x border-t">
          {/* Render filtered campus names */}
          {filteredCampuses.map((campus, index) => (
            <div key={index} className="border-b border-gray-300 py-4">
              <p className="text-center">{campus.campus_name} Campus</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayCampus;
