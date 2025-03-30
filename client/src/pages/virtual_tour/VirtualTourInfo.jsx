import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getUniversityData } from "@/api/component-info";
import { TbMap2 } from "react-icons/tb";
import { RiCameraLensLine } from "react-icons/ri";
import { MdTouchApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { loggedInUser } from "@/api/auth";
import Loading from "@/components/Loading";
import {fetchCampuses} from "@/api/component-info.js"

const VirtualTourInfo = () => {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
      queryKey: ["user"],
      queryFn: loggedInUser,
      refetchOnWindowFocus: false,
    });

    const { data: university } = useQuery({
        queryKey: ["universitysettings"],
        queryFn: getUniversityData,
    });

    const { data: campuses = [] } = useQuery({
        queryKey: ["campuses"],
        queryFn: fetchCampuses,
    });

      const totalFloors = campuses.reduce(
        (sum, campus) => sum + (campus.floors?.length || 0),
        0
      );
      
      const totalMarkerPhotos = campuses.reduce(
        (sum, campus) =>
          sum +
          (campus?.floors?.reduce(
            (floorSum, floor) =>
              floorSum +
              (floor?.markers?.filter((marker) => marker?.marker_photo_url)?.length || 0), // ✅ Fix: Add `?.`
            0
          ) || 0),
        0
      );
      

      const totalCategories = campuses.reduce(
        (total, campus) =>
          total +
          (campus?.floors?.reduce(
            (floorTotal, floor) =>
              floorTotal + (floor?.markers?.filter((marker) => marker?.category)?.length || 0), // ✅ Added `?.`
            0
          ) || 0),
        0
      );
      

  const handleBuildMode = () => {
    setLoadingMessage("Entering Build Mode");
    setLoadingVisible(true);

      setTimeout(() => {
        setLoadingVisible(false);
        navigate("/virtual-tour/build-mode");
    }, 3000);
  };

    return (
        <div className="w-[100%] flex gap-6 py-6">
      {loadingVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[400px] flex flex-col justify-center items-center gap-4 rounded-md shadow-md text-center">
            <Loading />
            <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
          </div>
        </div>
      )}
            <div className="border p-6 w-[45%] h-[450px] flex flex-col justify-between rounded-md">
                <div className="flex w-[100%]  justify-center gap-3">
                    <div className="flex gap-3 items-center justify-center">
                        <img className="h-[70px]" src={university?.university_vector_url} alt="" />
                        <img className="h-[70px]" src={university?.university_logo_url} alt="" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="font-bold font-cizel-decor text-xl">UNIVERSITY OF RIZAL SYSTEM</h2>
                        <h3 className="text-md font-cizel">NURTURING TOMORROW'S NOBLEST</h3>
                    </div>
                </div>
                <hr />
                <div className="flex items-center justify-center gap-[6.5rem]">
                    <div>
                        <div className="flex flex-row items-center justify-center gap-3">
                            <p className="text-[2rem] font-bold text-base-200">{totalFloors}</p>
                            <TbMap2 className="text-4xl text-base-200"/>
                        </div>
                        <p>Featured Locations</p>
                    </div>
                    <div>
                        <div className="flex flex-row items-center justify-center gap-3">
                            <p className="text-[2rem] font-bold text-base-200">{totalMarkerPhotos}</p>
                            <RiCameraLensLine className="text-4xl text-base-200"/>
                        </div>
                        <p>Panoramic View</p>
                    </div>
                    <div>
                        <div className="flex flex-row items-center justify-center gap-3">
                            <p className="text-[2rem] font-bold text-base-200">{totalCategories}</p>
                            <MdTouchApp className="text-4xl text-base-200 mb-2"/>
                        </div>
                        <p>Hotspots</p>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col gap-2 w-[100%]">
                    <div className="w-[100%] h-[55px] bg-base-200 rounded-md">
                        <button onClick={handleBuildMode} className="w-[100%] text-md text-white h-[100%] flex justify-center gap-4 items-center outline-none focus-none border-[1.5px] rounded-md">
                        <FaMapMarkerAlt className="text-lg"/>
                        <p className="font-medium">Enter Build Mode</p>
                        </button>
                    </div>        
                    <Link to="/virtual-tour/media-library" className="w-[100%] h-[50px]">
                        <button className="w-[100%] text-md h-[100%] flex justify-center gap-4 font-medium items-center border-base-200 outline-none focus-none border-[1.5px] rounded-md">
                        
                        <p className="text-base-200 font-medium">Media Library</p>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="border px-2 w-[55%] h-[450px] flex flex-col rounded-md items-center justify-center gap-3">
                <div className="w-[30%] flex gap-3 items-center justify-center">
                    <img className="h-[160px]" src={university?.university_vector_url} alt="" />
                    <img className="h-[160px]" src={university?.university_logo_url} alt="" />
                </div>
                <div className="w-[70%] flex flex-col justify-center items-center justify-center">
                    <h2 className="font-bold font-cizel-decor text-xl">UNIVERSITY OF RIZAL SYSTEM</h2>
                    <h3 className="text-md font-cizel">NURTURING TOMORROW'S NOBLEST</h3>
                </div>
            </div>
        </div>
    )
}

export default VirtualTourInfo;