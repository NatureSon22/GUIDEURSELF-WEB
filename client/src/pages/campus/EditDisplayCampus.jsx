import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Search from "../../assets/Search.png";
import Pen from "../../assets/Pen.png";
import Bin from "../../assets/Bin.png";
import Check from "../../assets/Check.png";
import addImage from "../../assets/add.png";
import UrsVector from "../../assets/UrsVector.png";
import UrsLogo from "../../assets/UrsLogo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { getUniversityData } from "@/api/component-info";

const EditDisplayCampus = () => {
  const [campusToDelete, setCampusToDelete] = useState(null);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(""); 
  const [campuses, setCampuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const {data:university, isLoading, isError} = useQuery ({
    queryKey: ["universitysettings"],
    queryFn: getUniversityData,
  });

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/campuses", {
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
  };

  // Proceed with Deletion
  const handleConfirmDelete = async () => {
    if (!campusToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/campuses/${campusToDelete._id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (response.ok) {
        console.log("Campus deleted successfully!");
        setCampuses((prevCampuses) =>
          prevCampuses.filter((c) => c._id !== campusToDelete._id)
        );
      } else {
        console.log("Failed to delete campus.");
      }

      setCampusToDelete(null); // Clear the selected campus
    } catch (error) {
      console.error("Error deleting campus:", error);
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

  const filteredCampuses = campuses.filter((campus) =>
    campus.campus_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-6">
      {loadingVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-xl font-semibold text-gray-800">
              {loadingMessage}
            </p>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Manage Campus</h2>
        <p className="text-gray-600 mt-2">
          See list of all campuses to manage and edit.
        </p>
      </div>
      <div className="w-full pt-6 flex gap-4">
        <div className="w-[80%] h-[40px] flex flex-row justify-between items-center py-1 px-2 rounded-md border-gray-300 border">
          <textarea
            className="overflow-hidden w-[95%] h-5 resize-none outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img className="h-[100%]" src={Search} alt="Search" />
        </div>

        <Link className="w-[12%]" to="/campus/add">
          <button className="w-[100%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300">
            <img className="w-[30px] h-[30px]" src={addImage} alt="Add Campus" />
            Add Campus
          </button>
        </Link>

        <button
          onClick={handleBack}
          className="w-[7%] text-md h-10 flex justify-evenly items-center outline-none focus-none border-[1.5px] rounded-md border-gray-400 text-gray-800 hover:bg-gray-200 transition duration-300"
        >
          <img className="w-[30px] h-[30px]" src={Check} alt="Save" />
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 py-6 rounded-md">
        {filteredCampuses.map((campus, index) => (
          <div
            key={index}
            className="pb-3 w-[330px] h-[370px] border border-gray-300 flex flex-col justify-center items-center rounded-md"
          >
            <div className="px-2 w-[100%] h-[100px] flex justify-between rounded-md">
              <div className="w-[30%] flex items-center justify-center">
                <img className="h-[45%]" src={university?.university_vector_url} alt="Vector" />
                <img className="h-[45%]" src={university?.university_logo_url} alt="Logo" />
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

              <AlertDialog>
                <AlertDialogTrigger onClick={() => handleDeleteClick(campus)}>
                  <img className="h-[25px]" src={Bin} alt="Delete" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                      Do you want to remove this campus?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-row !justify-center gap-[10px]">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-blue-500 text-white w-[100px] p-2 rounded-md"
                      onClick={handleConfirmDelete}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditDisplayCampus;
