import React from "react";

const OfficialCard = ({ official }) => {
  return (
    <div className="p-4 border flex flex-col items-center w-[250px] h-[360px] border-gray-300 rounded-md shadow-md bg-white">
      <img
        src={official.key_official_photo_url}
        alt={official.name}
        className="w-[200px] h-[200px] object-cover rounded-md"
      />
      <h3 className="mt-4 text-center text-md font-bold text-gray-800">
        {official.name}
      </h3>
      <p className="mt-2 text-center text-gray-600">{official.position_name}</p>
    </div>
  );
};

export default OfficialCard;
