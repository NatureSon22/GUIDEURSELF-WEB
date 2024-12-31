import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Input } from "@/components/ui/input"
import UrsVector from "../../assets/UrsVector.png";
import UrsLogo from "../../assets/UrsLogo.png";
import Pen from "../../assets/Pen.png";
import Search from "../../assets/Search.png";


const DisplayingKeyOfficials = () => {
  const [officials, setOfficials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/keyofficials", {method:"get", credentials:"include"} );
        if (!response.ok) {
          throw new Error("Failed to fetch key officials");
        }
        const data = await response.json();
        setOfficials(data);
      } catch (error) {
        console.error("Error fetching key officials:", error);
      }
    };

    fetchOfficials();
  }, []);

  const filteredOfficials = officials.filter((official) =>
    official.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="w-full p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Key Officials</h2>
          <p className="text-gray-600 mt-2">
            Manage university hierarchy, key officials, and their roles.
          </p>
        </div>
      </div>
      <div className="w-full p-6 flex gap-4">
        <div className="w-[100%] flex flex-row justify-between items-center py-1 px-2 rounded-md border-gray-300 border">
        <textarea
          className="overflow-hidden w-[95%] h-5 resize-none outline-none"
          placeholder="Search for an official..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <img className="h-[100%]" src={Search} alt="" />
        </div>
        
        <Link className="w-[7%]" to="/key-officials/edit">
          <button className="w-[100%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300">
            <img src={Pen} alt="" />
            Edit
          </button>
        </Link>
      </div>

      <div className="w-full flex flex-row items-center justify-center mt-8">
        <img src={UrsLogo} alt="" />
        <img src={UrsVector} alt="" />
      </div>

      <div className="w-full flex flex-col items-center justify-center mt-8">
        <h2 className="text-xl font-semibold mt-2">University of Rizal System</h2>
        <p className="text-gray-500 italic">Nurturing Tomorrow's Noblest</p>
      </div>

      <div className="p-6 mt-6">
        {filteredOfficials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7">
            {filteredOfficials.map((official, index) => (
              <div
                key={index}
                className="p-4 border flex flex-col items-center w-[250px] h-[360px] border-gray-300 rounded-md shadow-md bg-white"
              >
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
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No key officials found.</p>
        )}
      </div>

    </div>
  );
};

export default DisplayingKeyOfficials;
