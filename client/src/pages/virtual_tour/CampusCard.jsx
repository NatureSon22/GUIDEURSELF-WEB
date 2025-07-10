import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUniversityData } from "@/api/component-info";
import { TbMap2 } from "react-icons/tb";
import { RiCameraLensLine } from "react-icons/ri";''
import { MdTouchApp } from "react-icons/md";
import useToggleTheme from "@/context/useToggleTheme";

const CampusCard = ({ campus, closePopup }) => {
    const { isDarkMode } = useToggleTheme((state) => state);
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
      <div className="flex z-10 gap-4 h-[550px] w-[440px]">
        <div className={`${isDarkMode ? 'bg-dark-base-bg' : 'bg-white'} p-4 rounded-md shadow-lg flex flex-col gap-3`}>

          <div className="flex justify-center gap-3">
            <div className="w-[20%] gap-3 pr-6 py-2 flex items-center justify-center">
              <img className="h-[60px]" src={university?.university_vector_url} alt="" />
              <img className="h-[60px]" src={university?.university_logo_url} alt="" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className={`${isDarkMode ? "text-dark-text-base-300" : ""} font-bold text-base-400 font-cizel-decor text-xl`}>{campus.campus_name} Campus</h2>
              <h3 className={`${isDarkMode ? "text-dark-text-base-300" : ""} text-md text-secondary-200-80 font-cizel`}>NURTURING TOMORROW'S NOBLEST</h3>
            </div>
          </div>
          <div className="h-[200px]">
              <img
              className="object-cover h-[184px] w-[100%] rounded-md"
              src={campus.campus_cover_photo_url} alt="" />
          </div>
          <hr />
          <div className="flex items-center justify-around py-3">
            <div>
              <div className={` flex flex-row items-center justify-center gap-2`}>
                <p className={`${isDarkMode ? "text-dark-text-base-300" : ""} text-[1.5rem] font-bold text-base-200 !my-3`}>{totalFloors}</p>
                <TbMap2 className="text-4xl text-base-200 mb-1"/>
              </div>  
              <p className={`${isDarkMode ? "text-dark-text-base-300" : ""}  text-center text-base-400 text-[15px] !my-3`}>Featured Floors</p>
            </div>
            <div>
              <div className="flex flex-row items-center justify-center gap-2">
                <p className={`${isDarkMode ? "text-dark-text-base-300" : ""} text-[1.5rem] font-bold text-base-200 !my-3`}>{totalMarkerPhotos}</p>
                <RiCameraLensLine className="text-4xl text-base-200 mb-1"/>
              </div>
              <p className={`${isDarkMode ? "text-dark-text-base-300" : ""} text-center text-base-400 text-sm !my-3`}>Panoramic View</p>
            </div>
            <div>
              <div className="flex flex-row items-center justify-center gap-2">
                <p className={`${isDarkMode ? "text-dark-text-base-300" : ""} text-[1.5rem] font-bold text-base-200 !my-3`}>{totalCategories}</p>
                <MdTouchApp className="text-4xl text-base-200 mb-2"/>
              </div>
              <p className={`${isDarkMode ? "text-dark-text-base-300" : ""} text-center text-base-400 text-sm !my-3`}>Hotspots</p>
            </div>
          </div>
          <hr />
          <div className="flex gap-4">
              <button
              className={`${isDarkMode 
              ? "text-dark-text-base-300 border border-secondary-200" : "text-base-200 hover:bg-secondary-350"}  w-[50%] h-[50px] text-[20px] rounded-md `}
              onClick={closePopup}
              >
                  Close
              </button>
              <Link
               to={{
                pathname: `/virtual-tour/edit-mode/${campus._id}`,
              }}
              state={{ campus }}
              className="bg-base-200 w-[50%] !text-white text-[20px] h-[50px] flex justify-center items-center rounded-md">
                  <button
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