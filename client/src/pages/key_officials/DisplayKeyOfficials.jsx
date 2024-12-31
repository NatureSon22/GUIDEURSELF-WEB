import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchKeyOfficials } from "@/api/keyOfficialsApi";
import SearchBox from "@/components/SearchBox";
import OfficialCard from "@/components/OfficialCard";
import UrsVector from "@/assets/UrsVector.png";
import UrsLogo from "@/assets/UrsLogo.png";
import Pen from "@/assets/Pen.png";

const DisplayingKeyOfficials = () => {
  const [officials, setOfficials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getOfficials = async () => {
      const data = await fetchKeyOfficials();
      setOfficials(data);
    };
    getOfficials();
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
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <Link className="w-[7%]" to="/key-officials/edit">
          <button className="w-[100%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300">
            <img src={Pen} alt="Edit" />
            Edit
          </button>
        </Link>
      </div>

      <div className="w-full flex flex-row items-center justify-center mt-8">
        <img src={UrsLogo} alt="URS Logo" />
        <img src={UrsVector} alt="URS Vector" />
      </div>

      <div className="w-full flex flex-col items-center justify-center mt-8">
        <h2 className="text-xl font-semibold mt-2">University of Rizal System</h2>
        <p className="text-gray-500 italic">Nurturing Tomorrow's Noblest</p>
      </div>

      <div className="p-6 mt-6">
        {filteredOfficials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7">
            {filteredOfficials.map((official, index) => (
              <OfficialCard key={index} official={official} />
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
