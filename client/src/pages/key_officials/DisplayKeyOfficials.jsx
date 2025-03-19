import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchKeyOfficials } from "@/api/keyOfficialsApi";
import SearchBox from "@/components/SearchBox";
import OfficialCard from "@/components/OfficialCard";
import Pen from "@/assets/Pen.png";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";
import Header from "@/components/Header";
import FeaturePermission from "@/layer/FeaturePermission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPen } from "react-icons/fa6";

const DisplayingKeyOfficials = () => {
  
    const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: university,
    isLoading: universityLoading,
    isError: universityError,
  } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  
  const handleNavigate = (path) => {
    navigate(path);
  };

  const {
    data: officials,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["keyofficials"],
    queryFn: fetchKeyOfficials,
  });

  const filteredOfficials = officials?.filter((official) =>
    official.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full">
      <div className="flex w-[75%] flex-col justify-between">
        <Header
          title={"Key Officials"}
          subtitle={
            "Manage university hierarchy, key officials, and their roles."
          }
        />
      </div>

      <div className="flex w-full gap-4 py-6">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <FeaturePermission
          module="Manage Key Officials"
          access="edit key official"
        >
            <Button
              variant="outline"
              className="text-secondary-100-75"
              onClick={() => handleNavigate("/key-officials/edit")}
            >
                <FaPen /> Edit
            </Button>
        </FeaturePermission>
      </div>

      <div className="mt-8 flex w-full flex-row items-center justify-center">
        <img
          className="h-[140px]"
          src={university?.university_logo_url}
          alt="URS Logo"
        />
        <img
          className="h-[140px]"
          src={university?.university_vector_url}
          alt="URS Vector"
        />
      </div>

      <div className="mt-4 flex w-full flex-col items-center justify-center">
        <h2 className="font-cizel-decor mt-2 text-xl font-extrabold">
          University of Rizal System
        </h2>
        <p className="font-cizel text-[0.95rem] mt-1 font-semibold text-secondary-100-75/70">
          Nurturing Tomorrow&apos;s Noblest
        </p>
      </div>

      <div className="mt-12 py-6">
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
