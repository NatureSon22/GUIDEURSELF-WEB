import React, { useState } from "react";
import { Link } from "react-router-dom";
import Gallery from "@/assets/Gallery.png";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";
import TouchFinger from "@/assets/TouchFinger.png";
import Map from "@/assets/Map.png";
import Lens from "@/assets/Lens.png";

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

const SlideBar = ({ onCampusSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: campuses = [], isLoading, isError } = useQuery({
    queryKey: ["campuses"],
    queryFn: fetchCampuses,
  });

  const { data: university } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });
  
  const totalMarkers = campuses.reduce(
    (sum, campus) => sum + (campus.floors?.reduce(
      (floorSum, floor) => floorSum + (floor.markers?.length || 0), 0) || 0),
    0
  );

  const totalMarkerPhotos = campuses.reduce(
    (sum, campus) => sum + (campus.floors?.reduce(
      (floorSum, floor) =>
        floorSum + (floor.markers?.filter((marker) => marker.marker_photo_url)?.length || 0), 0) || 0),
    0
  );

  const filteredCampuses = campuses.filter((campus) =>
    campus.campus_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCampusClick = (campus) => {
    onCampusSelect(campus); // Pass the selected campus to the parent
  };

    return (  
    <div className="w-[40%] flex flex-col gap-3 p-6">
        <div className="flex flex-col justify-between h-[100%]">  
            <div>
              <div className="flex flex-col gap-1">
                  <div className="flex w-[100%] gap-3 justify-center">
                    <div className="flex w-[30%] justify-end items-center">
                      <img className="h-[40%]" src={university?.university_vector_url} alt="" />
                      <img className="h-[40%]" src={university?.university_logo_url} alt="" />
                    </div>
                    <div className="flex flex-col w-[70%] justify-center  ">
                      <h2 className="font-bold text-lg">UNIVERSITY OF RIZAL SYSTEM</h2>
                      <h3 className="text-sm">NURTURING TOMORROW'S NOBLEST</h3>
                    </div>
                  </div>
                  <hr className="pb-5" />
                  <div className=" pb-5 flex items-center justify-between gap-6 px-1">
                      <div>
                        <div className="flex flex-row items-center justify-center gap-3">
                          <p className="text-[1.5rem] font-bold text-base-200">{totalMarkers}</p>
                          <img className="h-[40px]" src={Map} alt="" />
                        </div>
                        <p className="text-center text-sm">Featured Locations</p>
                      </div>
                      <div>
                        <div className="flex flex-row items-center justify-center gap-3">
                          <p className="text-[1.5rem] font-bold text-base-200">{totalMarkerPhotos}</p>
                          <img className="h-[40px]" src={Lens} alt="" />
                        </div>  
                        <p className="text-center text-sm">360° View Available</p>
                      </div>
                      <div>
                        <div className="flex flex-row items-center justify-center gap-3">
                            <p className="text-[1.5rem] font-bold text-base-200">0</p>
                                <img className="h-[40px]" src={TouchFinger} alt="" />
                        </div>
                            <p className="text-center text-sm">Interactive Hotspots</p>
                      </div>
                  </div>
                  <hr />
              </div>
                <div className="py-4 flex flex-col gap-3">
                    <p className="text-sm">List of Campuses</p>
                    <div className="">
                    {filteredCampuses.map((campus, index) => (
                        <div
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleCampusClick(campus)}
                        >
                        <p>{campus.campus_name}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>

            <div>
                <div>
                    <Link
                    className="flex justify-center items-center h-[45px] rounded-md px-[50px] w-[100%] text-accent-100 bg-accent-500 hover:bg-accent-100 hover:text-white"
                    to="/virtual-tour"
                    >
                    <button>
                        Exit Build Mode
                    </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
    )
}

export default SlideBar;