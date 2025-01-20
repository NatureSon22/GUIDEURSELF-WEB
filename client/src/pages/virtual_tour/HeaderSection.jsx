  import TouchFinger from "@/assets/TouchFinger.png";
  import Map from "@/assets/Map.png";
  import Lens from "@/assets/Lens.png";

  const HeaderSection = ({ university, updatedCampus }) => {
 
  const totalMarkers = updatedCampus.floors?.reduce(
    (sum, floor) => sum + (floor.markers?.length || 0),
    0
  );

  // Calculate total markers with photo URLs
  const totalMarkerPhotos = updatedCampus.floors?.reduce(
    (sum, floor) =>
      sum +
      (floor.markers?.filter((marker) => marker.marker_photo_url)?.length || 0),
    0
  );  

  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-[100%] gap-3 justify-center">
        <div className="flex w-[30%] justify-end items-center">
          <img className="h-[40%]" src={university?.university_vector_url} alt="" />
          <img className="h-[40%]" src={university?.university_logo_url} alt="" />
        </div>
        <div className="flex flex-col w-[70%] justify-center  ">
          <h2 className="font-bold text-lg">UNIVERSITY OF RIZAL SYSTEM</h2>
          <h3 className="text-sm">{updatedCampus.campus_name} Campus</h3>
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
  );
};
    
    export default HeaderSection;
    