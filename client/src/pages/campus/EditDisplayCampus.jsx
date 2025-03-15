import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import React, { useState, useEffect } from "react";
import Search from "../../assets/Search.png";
import Pen from "../../assets/Pen.png";
import Bin from "../../assets/Bin.png";
import Check from "../../assets/Check.png";
import addImage from "../../assets/add.png";
import { IoAlertCircle } from "react-icons/io5";
import { getUniversityData } from "@/api/component-info";
import { useToast } from "@/hooks/use-toast";
import FeaturePermission from "@/layer/FeaturePermission";
import { loggedInUser } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";

const EditDisplayCampus = () => {
  const [campusToDelete, setCampusToDelete] = useState(null);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: university, isLoading, isError } = useQuery({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
          method: "get",
          credentials: "include",
        });
        const data = await response.json();
        setCampuses(data); // Store fetched campuses
      } catch (error) {
        console.error("Error fetching campuses:", error);
      }
    };

    fetchCampuses();
  }, []);

  const handleDeleteClick = (campus) => {
    setCampusToDelete(campus);
    setIsDeleteModalOpen(true);
  };

  const archiveCampus = async (campusId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/archived-campuses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campus_id: campusId }),
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to archive campus");
      }
  
      const data = await response.json();
      return data;
      toast({
        title: "Success",
        description: `Campus successfully archived and deleted: ${campusToDelete.campus_name}`,
        variant: "default",
      });
    } catch (error) {
        toast({
          title: "Error",
          description: `Failed to delete campus: ${campusToDelete.campus_name}`,
          variant: "destructive",
        });
    }
  };  

  const handleConfirmDelete = async () => {
    if (!campusToDelete) return;
  
    try {
      // Step 1: Check if the campus has related data
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/campuses/${campusToDelete._id}/dependencies`,
        { method: "GET", credentials: "include" }
      );
  
      const { hasDependencies } = await response.json();
  
      if (hasDependencies) {
        toast({
          title: "Error",
          description: "The campus cannot be deleted because there is some data depending on it.",
          variant: "destructive",
        });
        return; // STOP HERE, DO NOT DELETE CAMPUS
      }
  
      // Step 2: Archive the campus
      await archiveCampus(campusToDelete._id);
  
      // Step 3: Delete the campus
      const deleteResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/campuses/${campusToDelete._id}`,
        { method: "DELETE", credentials: "include" }
      );
  
      if (deleteResponse.ok) {
        toast({
          title: "Success",
          description: `Campus successfully archived and deleted: ${campusToDelete.campus_name}`,
          variant: "default",
        });
        setCampuses((prev) => prev.filter((c) => c._id !== campusToDelete._id));
      } else {
        toast({
          title: "Error",
          description: `Failed to delete campus: ${campusToDelete.campus_name}`,
          variant: "destructive",
        });
      }
  
      setIsDeleteModalOpen(false);
      setCampusToDelete(null);
    } catch (error) {
      console.error("Error deleting campus:", error);
      toast({
        title: "Error",
        description: "An error occurred while archiving or deleting the campus.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setLoadingMessage("Saving Changes...");
    setLoadingVisible(true);

    setTimeout(() => {
      setLoadingMessage("Changes have been successfully saved!");
      setTimeout(() => {
        setLoadingVisible(false);
        navigate("/campus"); // Navigate back to the campus list
      }, 1500);
    }, 3000);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Determine if the user has access to all campuses
  const isMultiCampus = user?.isMultiCampus ?? false;
  const userCampusId = user?.campus_id;

  // Step 1: Filter campuses based on the user's access
  const filteredByAccess = campuses.filter((campus) => {
    if (isMultiCampus) {
      // If user has access to all campuses, show all campuses
      return true;
    } else {
      // If user does not have access to all campuses, show only their campus
      return String(campus._id) === String(userCampusId);
    }
  });

  // Step 2: Apply the search filter and sort alphabetically
  const filteredCampuses = filteredByAccess
    .filter((campus) =>
      campus.campus_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.campus_name.localeCompare(b.campus_name)); // Sort alphabetically

  return (
    <div className="w-full">
      {loadingVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 flex flex-col justify-center items-center gap-4 rounded-md shadow-md text-center">
              <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
            </div>
        </div>
      )}
      <div className="w-[75%] flex flex-col justify-between">
        <Header
          title={"Manage Campus"}
          subtitle={"See list of all campuses to manage and edit."}
        />
      </div>
      <div className="w-full pt-6 flex gap-4">
        <div className="w-[100%] h-[40px] flex flex-row justify-between items-center py-1 px-2 rounded-md border-gray-300 border">
          <textarea
            className="overflow-hidden w-[95%] h-5 resize-none outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img className="h-[100%]" src={Search} alt="Search" />
        </div>

        <FeaturePermission module="Manage Campus" access="add campus">
          <Link className="w-[13%]" to="/campus/add">
            <button className="w-[100%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 ">
              <img className="w-[30px] h-[30px]" src={addImage} alt="Add Campus" />
              Add Campus
            </button>
          </Link>
        </FeaturePermission>
        <button
          onClick={handleBack}
          className="w-[7%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-base-200 text-base-200"
        >
          <img className="w-[30px] h-[30px]" src={Check} alt="Save" />
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 py-6 rounded-md">
        {filteredCampuses.map((campus, index) => (
          <div
            key={index}
            className="pb-3 w-[360px] h-[370px] border border-gray-300 flex flex-col justify-center items-center rounded-md"
          >
            <div className="px-2 w-[100%] h-[100px] flex justify-between rounded-md">
              <div className="w-[30%] gap-2 pt-3 pb-4 flex items-center justify-center">
                <img className="h-[50px]" src={university?.university_vector_url} alt="Vector" />
                <img className="h-[50px]" src={university?.university_logo_url} alt="Logo" />
              </div>
              <div className="w-[70%] flex flex-col justify-center">
                <h2 className="font-bold text-lg">{campus.campus_name} Campus</h2>
                <h3 className="text-[12px]">NURTURING TOMORROW'S NOBLEST</h3>
              </div>
            </div>

            <div className="px-6 w-[100%] h-[100%]">
              <img
                className="object-cover h-[100%] rounded-md"
                src={campus.campus_cover_photo_url}
                alt="Campus Cover"
              />
            </div>
            <div className="px-6 flex w-[100%] h-[150px] pt-[10px] justify-end gap-[10px]">
              <Link
                className="flex flex-col items-center justify-center"
                to={`/campus/edit-campus/${campus._id}`}
              >
                <img className="h-[18px]" src={Pen} alt="Edit" />
              </Link>

              <FeaturePermission module="Manage Campus" access="archive campus">
                <button onClick={() => handleDeleteClick(campus)}>
                  <img className="h-[25px]" src={Bin} alt="" />
                </button>
              </FeaturePermission>

              {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-[20%] flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-md shadow-md w-[500px] flex flex-col justify-center items-center  text-center">
                    <IoAlertCircle className="text-[3rem] w-[100%] text-base-200" />
                    <p className="text-gray-600 my-4">
                      Do you want to archive this campus?
                    </p>
                    <div className="flex justify-center w-[100%] gap-4 mt-4">
                      <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 text-secondary-210 bg-secondary-300 w-[100%] border border-secondary-210 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmDelete}
                        className="px-4 text-base-200 py-2 bg-base-210 w-[100%] border border-base-200 rounded-md"
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditDisplayCampus;