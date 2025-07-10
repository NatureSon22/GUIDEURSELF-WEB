import Add from "@/assets/add.png";
import Minus from "@/assets/minus.png";
import Pen from "@/assets/Pen.png";
import useToggleTheme from "@/context/useToggleTheme";

const FloorList = ({
  floors,
  selectedFloor,
  isEditing,
  toggleEditMode,
  confirmRemoveFloor,
  setSelectedFloor,
  handleAddFloorClick,
}) => {
  
  const { isDarkMode } = useToggleTheme((state) => state);
  const handleSelectFloor = (floor) => {
    setSelectedFloor(floor);
  };

  return (
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
                <img src={Pen} alt="Edit" />
              </button>
              <button
                onClick={handleAddFloorClick}
                className="h-[40px] w-[40px] border p-2 flex justify-center items-center"
              >
                <img src={Add} alt="Add Floor" />
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
        {floors?.map((floor) => (
          <div key={floor._id} className="flex flex-col">
            <div className="flex justify-between w-[100%]">
              {isEditing && (
                <button
                  onClick={() => confirmRemoveFloor(floor._id)}  // Ensure this correctly identifies the floor
                  className="h-[30px] w-[30px] flex justify-center items-center"
                >
                  <img className="pt-3" src={Minus} alt="Remove Floor" />
                </button>
              )}
              <h3
                onClick={() => handleSelectFloor(floor)}
                className={`font-semibold cursor-pointer p-2 mb-2 rounded flex-1 ${
                  selectedFloor && selectedFloor._id === floor._id
                    ? "bg-secondary-350 text-base-200"
                    : "bg-none"
                }`}
              >
                {floor.floor_name}
              </h3>
            </div>
            <div className="pl-4">
              {floor.markers?.map((marker) => (
                <div key={marker._id} className="mb-2">
                  <p className="text-md">{marker.marker_name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorList;
