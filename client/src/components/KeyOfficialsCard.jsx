import React from "react";
import Pen from "@/assets/Pen.png";
import Bin from "@/assets/Bin.png";

const KeyOfficialsCard = ({ official, onEdit, onDelete }) => (
  <div className="p-4 border flex flex-col justify-between items-center w-[250px] h-[100%] border-gray-300 rounded-md shadow-md bg-white">
    <img
      src={official.key_official_photo_url}
      alt={official.name}
      className="w-[200px] h-[200px] object-cover rounded-md"
    />
    <h3 className="mt-4 text-center text-md font-bold text-gray-800">
      {official.name}
    </h3>
    <p className="mt-2 text-center text-gray-600">{official.position_name}</p>

    <div className="flex w-full pt-2 justify-end gap-2">
      <button onClick={() => onEdit(official)}>
        <img className="h-[18px]" src={Pen} alt="Edit" />
      </button>
      <button onClick={() => onDelete(official)}>
        <img className="h-[25px]" src={Bin} alt="Delete" />
      </button>
    </div>
  </div>
);
export default KeyOfficialsCard;
