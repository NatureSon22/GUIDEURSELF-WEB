import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUniversityData } from "@/api/component-info";
import TouchFinger from "@/assets/TouchFinger.png";
import Map from "@/assets/Map.png";
import Lens from "@/assets/Lens.png";

const CampusCard = ({ campus, onClose }) => {

    const { data: university } = useQuery({
      queryKey: ["universitysettings"],
      queryFn: getUniversityData,
    });

    const totalMarkers = campus.floors?.reduce(
      (sum, floor) => sum + (floor.markers?.length || 0),
      0
    );
  
    // Calculate total markers with photo URLs
    const totalMarkerPhotos = campus.floors?.reduce(
      (sum, floor) =>
        sum +
        (floor.markers?.filter((marker) => marker.marker_photo_url)?.length || 0),
      0
    );  
  
    return (
      <div className="fixed inset-1 flex h-[550px] justify-end z-50 gap-4">
        <div className="bg-white p-4 rounded-md shadow-lg w-[22%] max-w-[600px] flex flex-col gap-3">
          <div className="flex w-[100%] justify-center gap-3">
            <div className="w-[20%] flex items-center justify-center">
              <img className="h-[40%]" src={university?.university_vector_url} alt="" />
              <img className="h-[40%]" src={university?.university_logo_url} alt="" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-bold text-lg">{campus.campus_name} Campus</h2>
              <h3 className="text-sm">NURTURING TOMORROW'S NOBLEST</h3>
            </div>
          </div>
          <div className="h-[200px]">
              <img
              className="object-cover h-[100%] rounded-md"
              src={campus.campus_cover_photo_url} alt="" />
          </div>
          <hr />
          <div className="py-6 flex items-center justify-center gap-6">
            <div>
              <div className="flex flex-row items-center justify-center gap-1">
                <p className="text-[1.5rem] font-bold text-base-200">{totalMarkers}</p>
                <img className="h-[40px]" src={Map} alt="" />
              </div>  
              <p className="text-center text-sm">Featured Locations</p>
            </div>
            <div>
              <div className="flex flex-row items-center justify-center gap-1">
                <p className="text-[1.5rem] font-bold text-base-200">{totalMarkerPhotos}</p>
                <img className="h-[40px]" src={Lens} alt="" />
              </div>
              <p className="text-center text-sm">360° View Available</p>
            </div>
            <div>
              <div className="flex flex-row items-center justify-center gap-1">
                <p className="text-[1.5rem] font-bold text-base-200">0</p>
                <img className="h-[40px]" src={TouchFinger} alt="" />
              </div>
              <p className="text-center text-sm">Interactive Hotspots</p>
            </div>
          </div>
          <hr />
          <div className="flex gap-4">
              <button
              onClick={onClose}
              className="text-base-200 w-[50%] h-[50px] rounded-md hover:bg-secondary-350"
              >
                  Close
              </button>
              <Link
               to={{
                pathname: `/virtual-tour/edit-mode/${campus._id}`,
              }}
              state={{ campus }}
              className="bg-base-200 w-[50%] text-white h-[50px] flex justify-center items-center rounded-md">
                  <button
                  onClick={onClose}
                  >
                      Edit
                  </button>
              </Link>
          </div>
        </div>
      </div>
    );
  };

  export default CampusCard;