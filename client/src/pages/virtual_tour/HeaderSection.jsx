import { TbMap2 } from "react-icons/tb";
import { RiCameraLensLine } from "react-icons/ri";
import { MdTouchApp } from "react-icons/md";

  const HeaderSection = ({ university, updatedCampus }) => {
 
  const totalMarkers = updatedCampus.floors?.reduce(
    (sum, floor) => sum + (floor.markers?.length || 0),
    0
  );

  const totalFloors = updatedCampus.floors?.length || 0;

  // Calculate total markers with photo URLs
  const totalMarkerPhotos = updatedCampus.floors?.reduce(
    (sum, floor) =>
      sum +
      (floor.markers?.filter((marker) => marker.marker_photo_url)?.length || 0),
    0
  );  

  
  const totalCategories = updatedCampus.floors?.reduce((total, floor) => {
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
    <div className="flex flex-col gap-1 px-6">
      <div className="flex w-[100%] py-6 gap-3 justify-center">
        <div className="flex gap-3 w-[30%] justify-end items-center">
          <img className="h-[60px]" src={university?.university_vector_url} alt="" />
          <img className="h-[60px]" src={university?.university_logo_url} alt="" />
        </div>
        <div className="flex flex-col w-[70%] justify-center  ">
          <h2 className="font-bold  font-cizel-decor text-lg">UNIVERSITY OF RIZAL SYSTEM</h2>
          <h3 className="text-sm font-cizel">{updatedCampus.campus_name} Campus</h3>
        </div>
      </div>
      <hr className="pb-5" />
      <div className=" pb-5 flex items-center justify-between gap-6 px-1">
          <div>
            <div className="flex flex-row items-center justify-center gap-3">
                <p className="text-[1.5rem] font-bold text-base-200">{totalFloors}</p>
                  <TbMap2 className="text-4xl text-base-200 mb-2"/>
            </div>
                <p className="text-center text-sm">Featured Locations</p>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-3">
                <p className="text-[1.5rem] font-bold text-base-200">{totalMarkerPhotos}</p>
                <RiCameraLensLine className="text-4xl text-base-200 mb-2"/>
            </div>
                <p className="text-center text-sm">Panoramic View Available</p>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-3">
                <p className="text-[1.5rem] font-bold text-base-200">{totalCategories}</p>
                <MdTouchApp className="text-4xl text-base-200 mb-2"/>
            </div>
                <p className="text-center text-sm">Hotspots</p>
          </div>
      </div>
    </div>
  );
};
    
    export default HeaderSection;
    