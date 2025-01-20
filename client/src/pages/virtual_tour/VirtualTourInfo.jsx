import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUniversityData } from "@/api/component-info";
import Gallery from "@/assets/Gallery.png"
import Pin from "@/assets/Pin.png"
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

const VirtualTourInfo = () => {

    const { data: university } = useQuery({
        queryKey: ["universitysettings"],
        queryFn: getUniversityData,
    });

    const { data: campuses = [] } = useQuery({
        queryKey: ["campuses"],
        queryFn: fetchCampuses,
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

    return (
        <div className="w-[100%] flex gap-6 py-6">
            <div className="border p-6 w-[45%] h-[450px] flex flex-col justify-between rounded-md">
                <div className="flex w-[100%]  justify-center gap-3">
                    <div className="flex items-center justify-center">
                        <img className="h-[55%]" src={university?.university_vector_url} alt="" />
                        <img className="h-[55%]" src={university?.university_logo_url} alt="" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="font-bold text-xl">UNIVERSITY OF RIZAL SYSTEM</h2>
                        <h3 className="text-md">NURTURING TOMORROW'S NOBLEST</h3>
                    </div>
                </div>
                <hr />
                <div className="flex items-center justify-center gap-6">
                    <div>
                        <div className="flex flex-row items-center justify-center gap-3">
                            <p className="text-[2rem] font-bold text-base-200">{totalMarkers}</p>
                            <img className="h-[50px]" src={Map} alt="" />
                        </div>
                        <p>Featured Locations</p>
                    </div>
                    <div>
                        <div className="flex flex-row items-center justify-center gap-3">
                            <p className="text-[2rem] font-bold text-base-200">{totalMarkerPhotos}</p>
                            <img className="h-[50px]" src={Lens} alt="" />
                        </div>
                        <p>360° View Available</p>
                    </div>
                    <div>
                        <div className="flex flex-row items-center justify-center gap-3">
                            <p className="text-[2rem] font-bold text-base-200">0</p>
                            <img className="h-[50px]" src={TouchFinger} alt="" />
                        </div>
                        <p>Interactive Hotspots</p>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col gap-2 w-[100%]">
                    <Link to="/virtual-tour/build-mode" className="w-[100%] h-[55px] bg-base-200 rounded-md">
                        <button className="w-[100%] text-md text-white h-[100%] flex justify-center gap-4 items-center outline-none focus-none border-[1.5px] rounded-md">
                        <img className="w-[17px] h-[17px]" src={Pin} alt="Add Officials" />
                        <p>Enter Build Mode</p>
                        </button>
                    </Link>        
                    <Link to="/virtual-tour/build-mode" className="w-[100%] h-[50px]">
                        <button className="w-[100%] text-md h-[100%] flex justify-center gap-4 items-center outline-none focus-none border-[1.5px] rounded-md">
                        <img className="w-[17px] h-[17px]" src={Gallery} alt="Add Officials" />
                        <p>Media Library</p>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="border px-2 w-[55%] h-[450px] flex flex-col rounded-md items-center justify-center gap-3">
                <div className="w-[30%] flex items-center justify-center">
                    <img className="h-[100%]" src={university?.university_vector_url} alt="" />
                    <img className="h-[100%]" src={university?.university_logo_url} alt="" />
                </div>
                <div className="w-[70%] flex flex-col justify-center items-center justify-center">
                    <h2 className="font-bold text-xl">UNIVERSITY OF RIZAL SYSTEM</h2>
                    <h3 className="text-md">NURTURING TOMORROW'S NOBLEST</h3>
                </div>
            </div>
        </div>
    )
}

export default VirtualTourInfo;