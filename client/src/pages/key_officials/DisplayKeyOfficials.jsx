import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchKeyOfficials } from "@/api/keyOfficialsApi";
import SearchBox from "@/components/SearchBox";
import OfficialCard from "@/components/OfficialCard";
import Pen from "@/assets/Pen.png";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";

const DisplayingKeyOfficials = () => {
  const [officials, setOfficials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {data:university, isLoading, isError} = useQuery ({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });  

  useEffect(() => {
    const getOfficials = async () => {
      const data = await fetchKeyOfficials();
      setOfficials(data);
    };
    getOfficials();
  }, []);

  const filteredOfficials = officials.filter((official) =>
    official.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Key Officials</h2>
          <p className="mt-2 text-gray-600">
            Manage university hierarchy, key officials, and their roles.
          </p>
        </div>
      </div>
      <div className="flex w-full gap-4 p-6">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <Link className="w-[7%]" to="/key-officials/edit">
          <button className="text-md focus-none flex h-10 w-[100%] items-center justify-evenly rounded-md border-[1.5px] border-gray-400 text-gray-800 outline-none transition duration-300 hover:bg-gray-200">
            <img src={Pen} alt="Edit" />
            Edit
          </button>
        </Link>
      </div>

      <div className="mt-8 flex w-full flex-row items-center justify-center">
        <img src={university?.university_logo_url} alt="URS Logo" />
        <img src={university?.university_vector_url} alt="URS Vector" />
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-center">
        <h2 className="mt-2 text-xl font-semibold">
          University of Rizal System
        </h2>
        <p className="italic text-gray-500">
          Nurturing Tomorrow&apos;s Noblest
        </p>
      </div>

      <div className="mt-6 p-6">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-5">
          {filteredOfficials.map((official, index) => (
            <OfficialCard key={index} official={official} />
          ))}
        </div>
      </div>


    </div>
  );
};

export default DisplayingKeyOfficials;
