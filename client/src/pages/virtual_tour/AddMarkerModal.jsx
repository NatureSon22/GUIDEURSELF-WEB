import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PanoramicViewer from "./PanoramicViewer";
import { loggedInUser } from "@/api/auth";
import { BsDoorOpenFill } from "react-icons/bs";
import { PiOfficeChairFill } from "react-icons/pi";
import { FaGraduationCap } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { ImManWoman } from "react-icons/im";  
import { HiSquaresPlus } from "react-icons/hi2";
import { useToast } from "@/hooks/use-toast";

const addMarker = async (campusId, selectedFloor, formData) => {
  try {
    // Add the marker
    const response = await fetch(
      `http://localhost:3000/api/campuses/${campusId}/floors/${selectedFloor._id}/markers`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      }
    );

    if (!response.ok) {
      console.error("Response error:", response.statusText);
      throw new Error("Failed to add marker.");
    }

    const data = await response.json();
    console.log("Server response:", data);

    // Log the activity
    const logResponse = await fetch("http://localhost:3000/api/virtualtourlogs", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json", // Ensure this header is set
      },
      body: JSON.stringify({
        campus_name: formData.get("campus_name"), // Ensure this is passed
        activity: formData.get("activity"), // Ensure this is passed
        updated_by: formData.get("updated_by"), // Ensure this is passed
      }),
    });
    
    if (!logResponse.ok) {
      console.error("Failed to log activity:", logResponse.statusText);
    }

    return data;
  } catch (error) {
    console.error("Error uploading marker:", error);
    throw new Error("Failed to add marker.");
  }
};

const AddMarkerModal = ({
  closeModal,
  selectedFloor,
  coordinates,
    campusId,
    updatedCampus
}) => {
  const [markerName, setMarkerName] = useState("");
  const [markerDescription, setMarkerDescription] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null); 
  const [imageFile, setImageFile] = useState(null);
  const [isMutating, setIsMutating] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isShowed, setIsShowed] = useState(true);
  const [category, setCategory] = useState("");
  const queryClient = useQueryClient(); 
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

  const { mutate: addNewMarker } = useMutation({
    mutationFn: (data) => addMarker(campusId, selectedFloor, data),
    onSuccess: () => {
      setIsMutating(false);
      queryClient.invalidateQueries(["campuses", campusId._id]); 
      closeModal();
    },
    onError: (error) => {
      console.error("Error adding marker:", error);
      
      toast({
        title: "Error",
        description: error.message || "Please.",
        status: "error",
        duration: 5000,  // Toast disappears after 5 seconds
      });
    },
  });
  const selectedAcademic = () => {
    setCategory("Academic Spaces");
  };

  const selectedServices = () => {
    setCategory("Student Services");
  };

  const selectedOffice = () => {
    setCategory("Administrative Offices");
  };

  const selectedAttraction = () => {
    setCategory("Campus Attraction");
  };

  const selectedUtility = () => {
    setCategory("Utility Areas");
  };

  const selectedOther = () => {
    setCategory("Others (Miscellaneous)");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result); 
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const showPreview = () => {
    setIsAllowed(true);
    setIsShowed(false);
  };

  const unshowPreview = () => {
    setIsAllowed(false);
    setIsShowed(true);
    setCategory("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!coordinates?.lat || !coordinates?.lng) {
      return toast({
        title: "Missing Location",
        description: "Please drop a pin on the map to set the location.",
        status: "error",
        duration: 5000,
      });
    }
  
    if (!markerName.trim()) {
      return toast({
        title: "Missing Name",
        description: "Please enter a marker name.",
        status: "error",
        duration: 5000,
      });
    }
  
    setIsMutating(true);
    const formData = new FormData();
  
    formData.append("marker_name", markerName);
    formData.append("latitude", parseFloat(coordinates.lat));
    formData.append("longitude", parseFloat(coordinates.lng));
  
    if (markerDescription.trim()) {
      formData.append("marker_description", markerDescription);
    }
  
    if (category.trim()) {
      formData.append("category", category);
    }
  
    if (imageFile) {
      formData.append("marker_photo", imageFile);
    }
  
    // Add logging data
    formData.append("updated_by", data?.username || "Unknown User");
    formData.append("activity", `Added new location ${markerName}`);
    formData.append("campus_name", `${updatedCampus.campus_name} Campus` || "Unknown Campus"); // Assuming `selectedFloor` has `campus_name`
  
    addNewMarker(formData);
  };

  return (
    <div className="bg-secondary-500 h-100vh w-[35%] border-l overflow-y-auto z-1">
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-[100%]">
        <div className="overflow-y-auto p-6 max-h-[calc(100vh-120px)]">

          <Label className="text-lg">Configure this Location</Label>

          <div className="mt-4">
            <Label className="text-[16px]">location</Label>
            <Input
            type="text"
            value={markerName}
            onChange={(e) => setMarkerName(e.target.value)}
            className="w-full p-2 mt-2 border bg-white border-gray-300 rounded-md"
            placeholder="Enter marker name"
            required
            />
          </div>

          <div className="mt-4">
              <Label className="text-[16px]">Upload 360 Photo</Label>
              <div className="flex justify-between mt-2 w-[100%]">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-white w-[50%] cursor-pointer mb-4"
              />
              </div>
              {newImagePreview ? (
              <div className="w-[100%] h-[250px] bg-secondary-200 rounded-md mb-4">
                <PanoramicViewer 
                  imageUrl={newImagePreview} 
                />
              </div>
              ) : (
              <div className="w-[100%] h-[250px] flex items-center justify-center border border-secondary-200 rounded-md border-dashed mb-4">
              <Label className="text-[16px] text-secondary-200">Upload 360 Photo</Label>
              </div>
              )}
              
              
            </div>

          {imageFile && (
            <div>
              {isShowed ? (
                <div className="flex justify-end items-center gap-4">
                <Button type="button" className="text-base-200 bg-base-250 cursor-pointer hover:bg-base-250 hover:border hover:border-base-200" onClick={showPreview}>
                  <p>Add Hotspot</p>
                </Button>
                </div>
              ) : (
                <div className="flex justify-end items-center gap-4">
                <Button type="button" variant="destructive" onClick={unshowPreview}>
                Remove Hotspot
                </Button>
                </div>
              )}
              {isAllowed && (
              <div>
                <div className="mt-4">
                <Label className="text-[16px]">Area Categories</Label>
                <Input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 mt-2 border bg-white border-gray-300 rounded-md"
                  placeholder="Choose category"
                />
                <div className="flex gap-3 mt-4">
                  <BsDoorOpenFill onClick={selectedAcademic} 
                  className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                    category === "Academic Spaces" ? "text-base-200 border-base-200 border" : "text-black"
                  }`}/>
                  <PiOfficeChairFill onClick={selectedOffice} 
                  className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                    category === "Administrative Offices" ? "text-base-200 border-base-200 border" : "text-black"
                    }`}/>
                  <FaGraduationCap onClick={selectedServices} 
                  className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                    category === "Student Services" ? "text-base-200 border-base-200 border" : "text-black"
                    }`}/>
                  <FaFlag onClick={selectedAttraction} 
                  className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                    category === "Campus Attraction" ? "text-base-200 border-base-200 border" : "text-black"
                    }`}/>
                  <ImManWoman onClick={selectedUtility} 
                  className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                    category === "Utility Areas" ? "text-base-200 border-base-200 border" : "text-black"
                    }`}/>
                  <HiSquaresPlus onClick={selectedOther} 
                  className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                    category === "Others (Miscellaneous)" ? "text-base-200 border-base-200 border" : "text-black"
                    }`}/>
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-[16px]">Description</Label>
                <Textarea
                  placeholder="Type your marker description here."
                  className="resize-none bg-white mt-2 h-[200px]"
                  value={markerDescription}
                  onChange={(e) => setMarkerDescription(e.target.value)}
                />
              </div>
            </div>
            )}
            </div>
          )}
            

          </div>
          <div className="mt-6 flex justify-end p-6 gap-[10px]">
            <button
              type="button"
              onClick={closeModal}
              className="text-base-200 w-[100px] p-2 border-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-base-200 text-white w-[100px] p-2 rounded-md"
              disabled={isMutating}
            >
              {isMutating ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
        <div>
                
              </div>
      </div>
  );
};

export default AddMarkerModal;