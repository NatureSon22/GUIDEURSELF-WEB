import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchKeyOfficials } from "@/api/keyOfficialsApi";
import SearchBox from "@/components/SearchBox";
import OfficialCard from "@/components/OfficialCard";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";
import Header from "@/components/Header";
import FeaturePermission from "@/layer/FeaturePermission";
import { Button } from "@/components/ui/button";
import { FaPen } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";

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
    official.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const groupedOfficials = {};

  filteredOfficials?.forEach((official) => {
    const campus = official.campus_name || "";
    if (!groupedOfficials[campus]) {
      groupedOfficials[campus] = [];
    }
    groupedOfficials[campus].push(official);
  });
  

    if (isLoading) {
      return <Skeleton className="rounded-md bg-secondary-200/40 py-24" />;
    }
  

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
      <h2 className="text-[25px] font-cizel font-bold">
      <span className="font-cizel-decor">U</span>niversity of <span className="font-cizel-decor">R</span>izal <span className="font-cizel-decor">S</span>ystem
    </h2>
        <p className="font-cizel text-lg">
          Nurturing Tomorrow&apos;s Noblest
        </p>
      </div>

      <div className="mt-12 py-6 px-4 sm:px-6 lg:px-8"> {/* Added horizontal padding for smaller screens */}
      {Object.entries(groupedOfficials).map(([campusName, officials]) => (
        <div key={campusName} className="mb-12">
          {campusName !== "" ? (
            <h2 className="text-2xl flex items-center gap-12 w-full font-bold font-cizel mb-12 text-center text-gray-800">
              <hr className="flex-grow border-secondary-200" />
              {`${campusName.toUpperCase()} CAMPUS`}
              <hr className="flex-grow border-secondary-200" />
            </h2>
          ) : (
            <h2 className="text-2xl font-bold font-cizel mb-12 text-center text-gray-800">
              {campusName}
            </h2>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {officials.map((official) => (
              <div
                key={official._id}
                className="box-shadow-200 flex px-2 flex-col items-center rounded-md border border-secondary-200/30 bg-white py-4"
              >
                <img
                  src={official.key_official_photo_url}
                  alt={official.name}
                  className="h-[200px] w-[210px] rounded-md object-cover"
                  loading="lazy"
                />
                <h3 className="text-md font-cizel-decor mt-5 text-[1.05rem] px-4 text-center font-bold text-gray-800">
                  {official.name}
                </h3>
                <p className="mt-2 font-cizel text-center text-gray-600">
                  {official.position_name}
                  {official.college_name ? ` - ${official.college_name}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      </div>
    </div>
  );
};

export default DisplayingKeyOfficials;
