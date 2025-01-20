import Add from "@/assets/add.png";
import Minus from "@/assets/minus.png";
import Pen from "@/assets/Pen.png";

const FloorList = ({
    floors,
    selectedFloor,
    isEditing,
    toggleEditMode,
    confirmRemoveFloor,
    setSelectedFloor,
    handleAddFloorClick,
  }) => (
    <div className="py-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm">List of Floors</p>
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={toggleEditMode}
                className="h-[40px] w-[40px] border p-2 flex justify-center items-center"
              >
                <img src={Pen} alt="" />
              </button>
              <button
                onClick={handleAddFloorClick}
                className="h-[40px] w-[40px] border p-2 flex justify-center items-center"
              >
                <img src={Add} alt="" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleEditMode}
              className="h-[40px] w-[80px] p-2 flex justify-center items-center hover:underline"
            >
              Save
            </button>
          )}
        </div>
      </div>
      <div>
        {floors?.map((floor, floorIndex) => (
          <div key={floorIndex} className="flex flex-col">
            <div className="flex justify-between w-[100%]">
              {isEditing && (
                <button
                  onClick={() => confirmRemoveFloor(floorIndex)}
                  className="h-[30px] w-[30px] flex justify-center items-center"
                >
                  <img className="pt-3" src={Minus} alt="" />
                </button>
              )}
              <h3
                onClick={() => setSelectedFloor(floor)}
                className={` font-semibold cursor-pointer p-2 mb-2 rounded flex-1 ${
                  selectedFloor === floor ? "bg-secondary-350 text-base-200" : "bg-none"
                }`}
              >
                {floor.floor_name}
              </h3>
            </div>
            <div className="pl-4">
                {floor.markers?.map((marker, markerIndex) => (
                <div key={markerIndex} className="mb-2">
                    <p className="text-md">{marker.marker_name}</p>
                </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default FloorList;
  