import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import LazyMediaPanoramicViewer from "./MediaPanoramicViewer";
import { MdOutlinePermMedia } from "react-icons/md";
import { loggedInUser } from "@/api/auth";
import { FaListUl } from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fetchMarkers = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/markers`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch markers.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch markers.");
  }

  return data.markers;
};

const fetchCampuses = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch campuses");
  }
  return response.json();
}

const MediaLibrary = () => {
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [clickIcon, setClickIcon] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const markersPerPage = 6;



  const showList = () => {
    setClickIcon(true);
  };

  const unshowList = () => {
    setClickIcon(false);
  };

  const { data: markers, isLoading: markersLoading, error: markersError } = useQuery({
    queryKey: ["markers"],
    queryFn: fetchMarkers,
  });

  const { data: campuses, isLoading: campusesLoading, error: campusesError } = useQuery({
    queryKey: ["campuses"],
    queryFn: fetchCampuses,
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

  if (markersLoading || campusesLoading || userLoading) return <p>Loading...</p>;
  if (markersError || campusesError)
    return <p>Error: {markersError?.message || campusesError?.message}</p>;

  const isMultiCampus = user?.isMultiCampus ?? false;
  const userCampusId = user?.campus_id;

  const filteredByAccess = markers.filter((marker) => {
    if (isMultiCampus) {
      return true;
    } else {
      return String(marker.campus_id) === String(userCampusId);
    }
  });

  const filteredMarkers = selectedCampus
    ? filteredByAccess.filter((marker) => String(marker.campus_id) === String(selectedCampus))
    : filteredByAccess;

  const finalMarkers = filteredMarkers
    .filter((marker) => marker.marker_photo_url)
    .filter((marker) =>
      marker.marker_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    
  // Calculate total pages
  const totalPages = Math.ceil(finalMarkers.length / markersPerPage);

  // Get current markers
  const startIndex = (currentPage - 1) * markersPerPage;
  const endIndex = startIndex + markersPerPage;
  const currentMarkers = finalMarkers.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col w-[100%] gap-6">
      <div className="w-[100%] flex flex-col justify-between gap-6">
        <Header
          title={"Media Library"}
          subtitle={"See uploaded media files in the virtual tour."}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="w-[66%] h-[40px] flex flex-row justify-between items-center py-2 px-2 rounded-md border-gray-300 border">
            <textarea
              className="overflow-hidden w-[100%] bg-secondary-500 h-6 resize-none border-none shadow-none outline-none"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <CiSearch />
          </div>
          <div className="flex justify-end gap-4 pr-2">
            {isMultiCampus && (
              <select
                name="campus"
                id="campus-select"
                className="border rounded p-2 outline-none"
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
              >
                <option value="">All Campuses</option>
                {campuses.map((campus) => (
                  <option key={campus._id} value={campus._id}>
                    {campus.campus_name}
                  </option>
                ))}
              </select>
            )}
            
            {!clickIcon ? (
              <button onClick={showList}>
                <FaListUl />
              </button>
            ) : (
              <button onClick={unshowList}>
                <MdOutlinePermMedia />
              </button>
            )}
          </div>
        </div>
        
        <hr className={`${clickIcon ? "mt-2" : "my-2"}`} />
        {!clickIcon ? (
              <div className="flex justify-between flex-col h-[100%]">
              <div className="grid grid-cols-3 gap-4">
                {currentMarkers.map((marker) => (
                  <div
                    key={marker._id}
                    className="border flex flex-col items-center gap-4 pb-2 w-[100%] h-[320px] border-gray-300 rounded-md shadow-md bg-white"
                  >
                    <LazyMediaPanoramicViewer imageUrl={marker.marker_photo_url} />
                    <div className="flex justify-between px-3 w-[100%] items-center h-[60px]">
                      <p className="marker-name text-sm">{marker.marker_name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(marker.date_added), { addSuffix: true }).replace(
                          "about ",
                          ""
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
        
              {/* Pagination */}
              <div className="flex justify-end gap-4 mt-4">
                
                <Button
                  variant="outline"
                  className="font-semibold text-secondary-100-75"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                <GrPrevious />
                Previous
              </Button>
              <Input
                type="number"
                min="1"
                value={currentPage}
                className="w-16 rounded border p-1 text-center"
              />
                <Button
                 variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                className="font-semibold text-secondary-100-75"
                >
                Next
                <GrNext />
              </Button>
              </div>
            </div>
        ) : (
          <>
            {finalMarkers.map((marker) => (
              <div
                key={marker._id}
                className="border-b-2 flex flex-col items-center w-[100%] h-[40px] border-gray-300"
              >
                <div className="flex justify-between px-3 w-[100%] items-center h-[60px]">
                  <p className="marker-name text-md">{marker.marker_name}</p>
                  <p className="text-md text-gray-500">
                    {formatDistanceToNow(new Date(marker.date_added), { addSuffix: true }).replace(
                      "about ",
                      ""
                    )}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;