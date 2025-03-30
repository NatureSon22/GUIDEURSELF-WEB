import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Pen from "../../assets/Pen.png";
import Bin from "../../assets/bin.png";
import { IoAlertCircle } from "react-icons/io5";
import { getUniversityData } from "@/api/component-info";
import { useToast } from "@/hooks/use-toast";
import FeaturePermission from "@/layer/FeaturePermission";
import { loggedInUser } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUserStore from "@/context/useUserStore";
import { FaCheck } from "react-icons/fa6";
import { RiAddLargeFill } from "react-icons/ri";
import { useMutation } from "@tanstack/react-query";

const EditDisplayCampus = () => {
  const { currentUser } = useUserStore((state) => state);
  const [campusToDelete, setCampusToDelete] = useState(null);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const logActivityMutation = useMutation({
    mutationFn: async (logData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/activitylogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
        credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to log activity");
        }
        return response.json();
        },
  });
  
  const handleNavigate = (path) => {
    navigate(path);
  };

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
        { method: "DELETE", credentials: "include" },
      );


  
      if (deleteResponse.ok) {
        await logActivityMutation.mutateAsync({
          user_number: currentUser.user_number, // Replace with actual user number
          username: currentUser.username, // Replace with actual username
          firstname: currentUser.firstname, // Replace with actual firstname
          lastname: currentUser.lastname, // Replace with actual lastname
          role_type: currentUser.role_type, // Replace with actual role type
          campus_name: currentUser.campus_name, // Replace with actual campus name
          action: `Archived ${campusToDelete.campus_name} Campus`,
          date_created: campusToDelete.date_added,
          date_last_modified: Date.now(),
      });
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
        
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}

            
          />

        <FeaturePermission module="Manage Campus" access="add campus">
            <Button 
            variant="outline"
            className="text-secondary-100-75"
            onClick={() => handleNavigate("/campus/add")}
              >
              <RiAddLargeFill /> 
              Add Campus
            </Button>
        </FeaturePermission>
        <Button
          onClick={handleBack}
          variant="outline"
          className="border-base-200 text-base-200 hover:text-base-200"
          >
          <FaCheck />
          Save
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-md py-6 md:grid-cols-2 lg:grid-cols-4">
        {filteredCampuses.map((campus, index) => (
          <div
            key={index}
            className="flex h-[370px] w-full max-w-[360px] flex-col items-center justify-center rounded-md border border-gray-300 pb-3"
          >
            {/* Header Section */}
            <div className="flex h-[100px] w-full items-center justify-between rounded-md px-2">
              {/* Logo and Vector */}
              <div className="flex w-[30%] items-center justify-center gap-2">
                <img
                  className="h-[50px] w-auto"
                  src={university?.university_vector_url}
                  alt="University Vector"
                />
                <img
                  className="h-[50px] w-auto"
                  src={university?.university_logo_url}
                  alt="University Logo"
                />
              </div>

              {/* Campus Name and Tagline */}
              <div className="flex w-[70%] flex-col justify-center">
                <h2 className="text-lg font-bold font-cizel-decor">
                  {campus.campus_name} Campus
                </h2>
                <h3 className="text-[12px] font-cizel">NURTURING TOMORROW'S NOBLEST</h3>
              </div>
            </div>

            {/* Campus Cover Photo */}
            <div className="h-[200px] w-full px-4">
              <img
                className="h-full w-full rounded-md object-cover"
                src={campus.campus_cover_photo_url}
                alt="Campus Cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex h-[50px] w-full items-center justify-end gap-2 px-4 pt-2">
              <Link
                className="flex items-center justify-center"
                to={`/campus/edit-campus/${campus._id}`}
              >
                <img className="h-[18px] w-auto" src={Pen} alt="Edit" />
              </Link>

              <FeaturePermission module="Manage Campus" access="archive campus">
                <button onClick={() => handleDeleteClick(campus)}>
                  <img className="h-[25px] w-auto" src={Bin} alt="Delete" />
                </button>
              </FeaturePermission>
            </div>
          </div>
        ))}
      </div>
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
  );
};

export default EditDisplayCampus;
