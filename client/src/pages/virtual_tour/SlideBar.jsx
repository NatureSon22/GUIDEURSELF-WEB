import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";
import { TbMap2 } from "react-icons/tb";
import { RiCameraLensLine } from "react-icons/ri";
import { MdTouchApp } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import useToggleTheme from "@/context/useToggleTheme";

const fetchCampuses = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch campuses");
  return response.json();
};

const fetchUserRole = async (roleType) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/role-types?name=${roleType}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch role data");
  return response.json();
};

const SlideBar = ({ onCampusSelect, exitBuildMode, userData }) => {
  const [searchTerm, setSearchTerm] = useState("");
    const { isDarkMode } = useToggleTheme((state) => state);

  const { data: campuses = [], isLoading, isError } = useQuery({
    queryKey: ["campuses"],
    queryFn: fetchCampuses,
  });

  const { data: university } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  const { data: userRole } = useQuery({
    queryKey: ["userRole", userData.role_type],
    queryFn: () => fetchUserRole(userData.role_type),
    enabled: !!userData.role_type, // Only fetch if `role_type` is defined
  });

  // Use `isMultiCampus` from `userData` or fallback to `false`
  const isMultiCampus = userData.isMultiCampus ?? false;

  const totalFloors = campuses.reduce(
    (sum, campus) => sum + (campus.floors?.length || 0),
    0
  );

  const totalMarkerPhotos = campuses.reduce(
    (sum, campus) =>
      sum +
      (campus.floors?.reduce(
        (floorSum, floor) =>
          floorSum + (floor.markers?.filter((marker) => marker.marker_photo_url)?.length || 0),
        0
      ) || 0),
    0
  );

  const totalCategories = campuses.reduce((total, campus) => {
    campus.floors?.forEach((floor) => {
      floor.markers?.forEach((marker) => {
        if (marker.category) {
          total += 1;
        }
      });
    });
    return total;
  }, 0);

  // Filter and sort campuses alphabetically
  const filteredCampuses = campuses
    .filter((campus) => (isMultiCampus ? true : campus._id === userData.campus_id))
    .filter((campus) => campus.campus_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.campus_name.localeCompare(b.campus_name)); // Sort alphabetically

    

  const handleCampusClick = (campus) => {
    onCampusSelect(campus);
  };
  return (
    <div className={`${isDarkMode ? 'bg-dark-base-bg' : 'bg-white'} w-[40%] flex flex-col gap-3 p-6 z-20`}>
      <div className={`flex flex-col justify-between h-[100%]`}>
        <div>
          <div className="flex flex-col gap-1 justify-between">
            <div className="flex w-[100%] gap-3 pb-6 justify-center">
              <div className="flex w-[30%] gap-3 justify-end items-center">
                <img className="h-[60px]" src={university?.university_vector_url} alt="" />
                <img className="h-[60px]" src={university?.university_logo_url} alt="" />
              </div>
              <div className="flex flex-col w-[70%] justify-center">
                <h2 className={`${isDarkMode ? "text-dark-text-base-300" : ""} font-bold font-cizel-decor text-lg`}>University Of Rizal System</h2>
                <h3 className={` ${isDarkMode ? "text-dark-text-base-300" : ""} text-sm font-cizel`}>NURTURING TOMORROW'S NOBLEST</h3>
              </div>
            </div>
            <hr className="pb-5" />
            <div className="pb-5 flex items-center justify-between gap-6 px-1">
              <div>
                <div className="flex flex-row items-center justify-center gap-3">
                  <p className={` ${isDarkMode ? "text-dark-text-base-300" : ""} text-[1.5rem] font-bold text-base-200`}>{totalFloors}</p>
                  <TbMap2 className="text-4xl text-base-200 mb-2" />
                </div>
                <p className={` ${isDarkMode ? "text-dark-text-base-300" : ""} text-center text-sm`}>Featured Floors</p>
              </div>
              <div>
                <div className="flex flex-row items-center justify-center gap-3">
                  <p className={` ${isDarkMode ? "text-dark-text-base-300" : ""} text-[1.5rem] font-bold text-base-200`}>{totalMarkerPhotos}</p>
                  <RiCameraLensLine className="text-4xl text-base-200 mb-2" />
                </div>
                <p className={` ${isDarkMode ? "text-dark-text-base-300" : ""} text-center text-sm`}>Panoramic View</p>
              </div>
              <div>
                <div className="flex flex-row items-center justify-center gap-3">
                  <p className={` ${isDarkMode ? "text-dark-text-base-300" : ""} text-[1.5rem] font-bold text-base-200`}>{totalCategories}</p>
                  <MdTouchApp className="text-4xl text-base-200 mb-2" />
                </div>
                <p className={` ${isDarkMode ? "text-dark-text-base-300" : ""} text-center text-sm`}>Hotspots</p>
              </div>
            </div>
            <hr />
          </div>
          <div className="py-4 flex flex-col gap-3">
            <p className={` ${isDarkMode ? "text-dark-text-base-300" : ""} text-sm`}>List of Campuses</p>
            <div>
              {filteredCampuses.map((campus, index) => (
                <button
                  key={index}
                  className={` ${isDarkMode ? "hover:text-black text-dark-text-base-300" : ""} p-2 cursor-pointer hover:bg-gray-100 w-full rounded-md flex justify-between items-center`}
                  onClick={() => handleCampusClick(campus)}
                >
                  <p>{campus.campus_name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div
            onClick={exitBuildMode}
            className={`flex justify-center items-center h-[45px] gap-2 px-[50px] w-full cursor-pointer
            ${isDarkMode 
              ? "text-dark-text-base-300 border border-secondary-200" 
              : "bg-accent-150 text-accent-100 hover:bg-accent-100 hover:text-white"} 
                  rounded-md`}
            >
            <FaMapMarkerAlt />
            <button>Exit Build Mode</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideBar;