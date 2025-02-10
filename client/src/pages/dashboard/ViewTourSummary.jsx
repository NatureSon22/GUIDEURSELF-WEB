import { TbMap2 } from "react-icons/tb";
import { RiCameraLensLine } from "react-icons/ri";
import { MdTouchApp } from "react-icons/md";
import {fetchCampuses} from "@/api/component-info.js"
import { useQuery } from "@tanstack/react-query";

const ViewTourSummary = () => {

  const { data: campuses = [] } = useQuery({
    queryKey: ["campuses"],
    queryFn: fetchCampuses,
  });

  const totalFloors = campuses.reduce(
    (sum, campus) => sum + (campus.floors?.length || 0),
    0
  );
  
  const totalMarkerPhotos = campuses.reduce(
    (sum, campus) => sum + (campus.floors?.reduce(
      (floorSum, floor) =>
        floorSum + (floor.markers?.filter((marker) => marker.marker_photo_url)?.length || 0), 0) || 0),
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
  
  return (
    <div className="space-y-5 rounded-xl border border-secondary-200/50 bg-white px-7 py-7">
      <p className="font-medium">View Tour Summary</p>

      <div className="flex justify-between px-2">
        <div className="grid place-items-center space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold">{totalFloors}</p>
            <TbMap2 className="text-4xl text-base-200" />
          </div>
          <p className="text-[0.9rem]">Total Locations Featured</p>
        </div>

        <div className="grid place-items-center space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold">{totalMarkerPhotos}</p>
            <RiCameraLensLine className="text-4xl text-base-200" />
          </div>
          <p className="text-[0.9rem]">Total 360&deg; View Available</p>
        </div>

        <div className="grid place-items-center space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold">{totalCategories}</p>
            <MdTouchApp className="text-4xl text-base-200" />
          </div>
          <p className="text-[0.9rem]">Total Interactive Hotspots</p>
        </div>
      </div>
    </div>
  );
};

export default ViewTourSummary;
