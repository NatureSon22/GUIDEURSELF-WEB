import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import React, { useState, useEffect } from "react";
import Search from "../../assets/Search.png";
import Pen from "../../assets/Pen.png";
import Bin from "../../assets/bin.png";
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

  const {
    data: university,
    isLoading,
    isError,
  } = useQuery({
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
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/campuses`,
          {
            method: "get",
            credentials: "include",
          },
        );
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/archived-campuses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ campus_id: campusId }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to archive campus");
      }

      const data = await response.json();
      return data;
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
      // Step 1: Archive the campus
      await archiveCampus(campusToDelete);

      // Step 2: Delete the campus from the active list
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/campuses/${campusToDelete._id}`,
        { method: "DELETE", credentials: "include" },
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: `Campus successfully archived and deleted: ${campusToDelete.campus_name}`,
          variant: "default",
        });
        setCampuses((prevCampuses) =>
          prevCampuses.filter((c) => c._id !== campusToDelete._id),
        );
      } else {
        toast({
          title: "Error",
          description: `Failed to delete campus: ${campusToDelete.campus_name}`,
          variant: "destructive",
        });
      }

      setIsDeleteModalOpen(false);
      setCampusToDelete(null); // Clear the selected campus
    } catch (error) {
      console.error("Error deleting campus:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while archiving or deleting the campus.",
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
      campus.campus_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => a.campus_name.localeCompare(b.campus_name)); // Sort alphabetically

  return (
    <div className="w-full">
      {loadingVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-6 text-center shadow-md">
            <p className="text-xl font-semibold text-gray-800">
              {loadingMessage}
            </p>
          </div>
        </div>
      )}
      <div className="flex w-[75%] flex-col justify-between">
        <Header
          title={"Manage Campus"}
          subtitle={"See list of all campuses to manage and edit."}
        />
      </div>
      <div className="flex w-full gap-4 pt-6">
        <div className="flex h-[40px] w-[100%] flex-row items-center justify-between rounded-md border border-gray-300 px-2 py-1">
          <textarea
            className="h-5 w-[95%] resize-none overflow-hidden outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img className="h-[100%]" src={Search} alt="Search" />
        </div>

        <FeaturePermission module="Manage Campus" access="add campus">
          <Link className="w-[13%]" to="/campus/add">
            <button className="text-md focus-none flex h-10 w-[100%] items-center justify-evenly rounded-md border-[1.5px] border-gray-400 text-gray-800 outline-none hover:bg-gray-200">
              <img
                className="h-[30px] w-[30px]"
                src={addImage}
                alt="Add Campus"
              />
              Add Campus
            </button>
          </Link>
        </FeaturePermission>
        <button
          onClick={handleBack}
          className="text-md focus-none flex h-10 w-[7%] items-center justify-evenly rounded-md border-[1.5px] border-base-200 text-base-200 outline-none"
        >
          <img className="h-[30px] w-[30px]" src={Check} alt="Save" />
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-md py-6 md:grid-cols-2 lg:grid-cols-4">
        {filteredCampuses.map((campus, index) => (
          <div
            key={index}
            className="flex h-[370px] w-[360px] flex-col items-center justify-center rounded-md border border-gray-300 pb-3"
          >
            <div className="flex h-[100px] w-[100%] justify-between rounded-md px-2">
              <div className="flex w-[30%] items-center justify-center">
                <img
                  className="h-[45%]"
                  src={university?.university_vector_url}
                  alt="Vector"
                />
                <img
                  className="h-[45%]"
                  src={university?.university_logo_url}
                  alt="Logo"
                />
              </div>
              <div className="flex w-[70%] flex-col justify-center">
                <h2 className="text-lg font-bold">
                  {campus.campus_name} Campus
                </h2>
                <h3 className="text-[12px]">NURTURING TOMORROW'S NOBLEST</h3>
              </div>
            </div>

            <div className="h-[100%] w-[100%] px-6">
              <img
                className="h-[100%] rounded-md object-cover"
                src={campus.campus_cover_photo_url}
                alt="Campus Cover"
              />
            </div>
            <div className="flex h-[150px] w-[100%] justify-end gap-[10px] px-6 pt-[10px]">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-[20%]">
                  <div className="flex w-[500px] flex-col items-center justify-center rounded-md bg-white p-6 text-center shadow-md">
                    <IoAlertCircle className="w-[100%] text-[3rem] text-base-200" />
                    <p className="my-4 text-gray-600">
                      Do you want to archive this campus?
                    </p>
                    <div className="mt-4 flex w-[100%] justify-center gap-4">
                      <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="w-[100%] rounded-md border border-secondary-210 bg-secondary-300 px-4 py-2 text-secondary-210"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmDelete}
                        className="w-[100%] rounded-md border border-base-200 bg-base-210 px-4 py-2 text-base-200"
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
