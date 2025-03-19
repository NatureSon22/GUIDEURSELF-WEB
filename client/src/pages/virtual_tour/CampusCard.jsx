import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUniversityData } from "@/api/component-info";
import { TbMap2 } from "react-icons/tb";
import { RiCameraLensLine } from "react-icons/ri";
import { MdTouchApp } from "react-icons/md";

const CampusCard = ({ campus, onClose }) => {

    const { data: university } = useQuery({
      queryKey: ["universitysettings"],
      queryFn: getUniversityData,
    });

    const totalMarkers = campus.floors?.reduce(
      (sum, floor) => sum + (floor.markers?.length || 0),
      0
    );


  const totalFloors = campus.floors?.length || 0;
  
    // Calculate total markers with photo URLs
    const totalMarkerPhotos = campus.floors?.reduce(
      (sum, floor) =>
        sum +
        (floor.markers?.filter((marker) => marker.marker_photo_url)?.length || 0),
      0
    );  

    const totalCategories = campus.floors?.reduce((total, floor) => {
      // Loop through each marker in the floor
      floor.markers?.forEach((marker) => {
        if (marker.category) {
          // Increment the total count for each category
          total += 1;
        }
      });
      return total;
    }, 0) || 0;
  
    return (
      <div className="fixed inset-3 flex h-[550px] justify-end z-10 gap-4">
        <div className="bg-white p-4 rounded-md shadow-lg w-[22%] max-w-[600px] flex flex-col gap-3">
          <div className="flex w-[100%] justify-center gap-3">
            <div className="w-[20%] gap-3 pr-6 py-2 flex items-center justify-center">
              <img className="h-[60px]" src={university?.university_vector_url} alt="" />
              <img className="h-[60px]" src={university?.university_logo_url} alt="" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-bold  font-cizel-decor text-lg">{campus.campus_name} Campus</h2>
              <h3 className="text-sm  font-cizel">NURTURING TOMORROW'S NOBLEST</h3>
            </div>
          </div>
          <div className="h-[200px]">
              <img
              className="object-cover max-h-[184px] w-[100%] rounded-md"
              src={campus.campus_cover_photo_url} alt="" />
          </div>
          <hr />
          <div className="py-6 flex items-center justify-center gap-6">
            <div>
              <div className="flex flex-row items-center justify-center gap-2">
                <p className="text-[1.5rem] font-bold text-base-200">{totalFloors}</p>
                <TbMap2 className="text-4xl text-base-200 mb-1"/>
              </div>  
              <p className="text-center text-sm mt-2">Featured Locations</p>
            </div>
            <div>
              <div className="flex flex-row items-center justify-center gap-2">
                <p className="text-[1.5rem] font-bold text-base-200">{totalMarkerPhotos}</p>
                <RiCameraLensLine className="text-4xl text-base-200 mb-1"/>
              </div>
              <p className="text-center text-sm mt-2">360° View Available</p>
            </div>
            <div>
              <div className="flex flex-row items-center justify-center gap-2">
                <p className="text-[1.5rem] font-bold text-base-200">{totalCategories}</p>
                <MdTouchApp className="text-4xl text-base-200 mb-2"/>
              </div>
              <p className="text-center text-sm mt-2">Hotspots</p>
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