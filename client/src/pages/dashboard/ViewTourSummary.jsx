import { TbMap2 } from "react-icons/tb";
import { RiCameraLensLine } from "react-icons/ri";
import { MdTouchApp } from "react-icons/md";

const ViewTourSummary = () => {
  return (
    <div className="space-y-5 rounded-xl border border-secondary-200/50 bg-white px-7 py-7">
      <p className="font-medium">View Tour Summary</p>

      <div className="flex justify-between px-2">
        <div className="grid place-items-center space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold">1574</p>
            <TbMap2 className="text-4xl text-base-200" />
          </div>
          <p className="text-[0.9rem]">Total Locations Featured</p>
        </div>

        <div className="grid place-items-center space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold">289</p>
            <RiCameraLensLine className="text-4xl text-base-200" />
          </div>
          <p className="text-[0.9rem]">Total 360&deg; View Available</p>
        </div>

        <div className="grid place-items-center space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold">124</p>
            <MdTouchApp className="text-4xl text-base-200" />
          </div>
          <p className="text-[0.9rem]">Total Interactive Hotspots</p>
        </div>
      </div>
    </div>
  );
};

export default ViewTourSummary;
