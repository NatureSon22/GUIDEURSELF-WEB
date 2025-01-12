import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchKeyOfficials } from "@/api/keyOfficialsApi";
import SearchBox from "@/components/SearchBox";
import OfficialCard from "@/components/OfficialCard";
import Pen from "@/assets/Pen.png";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";
import Header from "@/components/Header";

const DisplayingKeyOfficials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: university, isLoading: universityLoading, isError: universityError } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  const { data: officials, isLoading, isError } = useQuery({
    queryKey: ["keyofficials"],
    queryFn: fetchKeyOfficials,
  });

  const filteredOfficials = officials?.filter((official) =>
    official.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || universityLoading) {
    return <p>Loading...</p>;
  }

  if (isError || universityError) {
    return <p>Error loading data.</p>;
  }

  return (
    <div className="w-full">
      <div className="w-[75%] flex flex-col justify-between">
        <Header
          title={"Key Officials"}
          subtitle={"Manage university hierarchy, key officials, and their roles."}
        />
      </div>

      <div className="flex w-full gap-4 py-6">
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
        <p className="italic text-gray-500">Nurturing Tomorrow&apos;s Noblest</p>
      </div>

      <div className="mt-6 py-6">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-5">
          {filteredOfficials?.map((official, index) => (
            <OfficialCard key={index} official={official} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayingKeyOfficials;
