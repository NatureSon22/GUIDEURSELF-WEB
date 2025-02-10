import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PanoramicViewer from "./PanoramicViewer";
import { BsDoorOpenFill } from "react-icons/bs";
import { PiOfficeChairFill } from "react-icons/pi";
import { FaGraduationCap } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { ImManWoman } from "react-icons/im";  
import { HiSquaresPlus } from "react-icons/hi2";
import { loggedInUser } from "@/api/auth";
import MediaPanoramicViewer from "./MediaPanoramicViewer";
import { IoAlertCircle } from "react-icons/io5";

const updateMarker = async (campusId, floorId, markerId, updatedData, imageFile) => {
  const formData = new FormData();
  formData.append("marker_name", updatedData.marker_name);
  formData.append("marker_description", updatedData.marker_description);
  formData.append("category", updatedData.category);
  
  if (updatedData.latitude !== null && !isNaN(updatedData.latitude)) {
    formData.append("latitude", updatedData.latitude);
  }
  if (updatedData.longitude !== null && !isNaN(updatedData.longitude)) {
    formData.append("longitude", updatedData.longitude);
  }

  if (imageFile) {
    formData.append("marker_photo", imageFile);
  }

  const response = await fetch(
    `http://localhost:3000/api/campuses/${campusId}/floors/${floorId}/markers/${markerId}`,
    {
      method: "PUT",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update marker");
  }

  const updatedMarker = await response.json();

  // Log the activity after successful update
  const logResponse = await fetch("http://localhost:3000/api/virtualtourlogs", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      campus_name: updatedData.campus_name || "Unknown Campus",
      activity: `Updated a location: ${updatedData.marker_name}`,
      updated_by: updatedData.updated_by || "Unknown User",
    }),
  });

  if (!logResponse.ok) {
    console.error("Failed to log activity:", logResponse.statusText);
  }

  return updatedMarker;
};

const EditMarkerModal = 
({ 
  marker, 
  campusId, 
  floorId, 
  onClose, 
  coordinates, 
  refreshMarkers, 
  exitModal,
  updatedCampus 
}) => {
  const { toast } = useToast();
  const [markerName, setMarkerName] = useState(marker.marker_name || "");
  const [markerDescription, setMarkerDescription] = useState(marker.marker_description || "");
  const [category, setCategory] = useState(marker.category|| "");
  const [latitude, setLatitude] = useState(coordinates.lat);
  const [longitude, setLongitude] = useState(coordinates.lng);
  const [imageFile, setImageFile] = useState(marker.marker_photo_url);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [isMutating, setIsMutating] = useState(false);
  const [isShowed, setIsShowed] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isPanorama, setIsPanorama] = useState(false);
  const modalRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const queryClient = useQueryClient(); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsPanorama(false); // Close when clicking outside
      }
    };

    if (isPanorama) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPanorama]);

  const showPanorama = () => {
    console.log("click");
    setIsPanorama(true);
  };

  const previewImage = newImagePreview || marker.marker_photo_url;

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

  const showPreview = () => {
    setIsAllowed(true);
    setIsShowed(false);
  }

  
  const unshowPreview = () => {
    setIsAllowed(false);
    setIsShowed(true);
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 10485760; // 10MB
  
    if (file) {
      if (file.size > maxSize) {
        setErrorMessage(`File size too large. Maximum is 10MB.`);
        
        setTimeout(() => {
          setErrorMessage(""); // Clear the error message after 3 seconds
        }, 3000);
  
        return; // Ensure the function stops execution here
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  

  
  const selectedAcademic = () =>{
    setCategory("Academic Spaces");
  };

  
  const selectedServices = () =>{
    setCategory("Student Services");
  };

  
  const selectedOffice = () =>{
    setCategory("Administrative Offices");
  };

  
  const selectedAttraction = () =>{
    setCategory("Campus Attraction");
  };

  
  const selectedUtility = () =>{
    setCategory("Utility Areas");
  };
  
  const selectedOther = () =>{
    setCategory("Others (Miscellaneous)");
  };
    
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!markerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a marker name.",
        type: "destructive",
      });
      return;
    }
  
    setIsMutating(true);
  
    try {
      await updateMarker(
        campusId,
        floorId,
        marker._id,
        {
          marker_name: markerName,
          marker_description: markerDescription.trim() ? markerDescription : "",
          category: category.trim() ? category : "",
          latitude: coordinates.lat !== null ? parseFloat(coordinates.lat) : null,
          longitude: coordinates.lng !== null ? parseFloat(coordinates.lng) : null,
          campus_name: updatedCampus.campus_name,  // Add the campus name here
          updated_by: data?.username || "Unknown User",  // Add the user data here
        },
        imageFile
      );
  
      if (typeof refreshMarkers === "function") {
        refreshMarkers();
      }
  
      queryClient.invalidateQueries(["campuses", campusId]);
  
      toast({
        title: "Success",
        description: "Marker updated successfully",
      });
  
      onClose();
    } catch (error) {
      console.error("Update Marker Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update marker.",
        type: "destructive",
      });
    } finally {
      setIsMutating(false);
    }
    exitModal();
  };
  
  return (
    <div className="bg-secondary-500 h-100vh w-[37%] border-l overflow-y-auto">
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
                    className="bg-white w-[50%] cursor-pointer mb-4 py-1 px-0"
                  />
                </div>
                {previewImage ? (
                  <div className="w-[100%] h-[250px] bg-secondary-200 rounded-md mb-4 relative">
                    <div className="z-50 fixed flex justify-center items-center bg-black w-[625px] h-[250px] rounded-md opacity-0 hover:opacity-70 transition-opacity duration-400">
                      <Button type="button" onClick={showPanorama} className="text-white h-[40px]">
                        Click to Preview
                      </Button>
                    </div>
                    <PanoramicViewer imageUrl={previewImage} />
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
                              <p>Edit Hotspot</p>
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
              <div className="mt-6 flex justify-between p-6 gap-[10px]">
                {errorMessage && (
                  <div className="flex border rounded-md w-[1500px] border-accent-100 p-2 gap-2 items-center">
                    <IoAlertCircle className="text-accent-100 h-[25px] w-[25px]"/>
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  </div>
                )}
                <div className="w-[100%] flex gap-1 justify-end">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="text-base-200 bg-white shadow-none hover:bg-secondary-350 w-[100px] p-2 border-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="border border-base-200 bg-base-200 text-white w-[100px] p-2 rounded-md hover:bg-base-200"
                    disabled={isMutating}
                  >
                    {isMutating ? "Saving..." : "Save"}
                  </Button>
              </div>
            </div>
            </form>
          <div>   
        </div>
        {isPanorama && (
        <div className="bg-black absolute z-50 flex justify-center items-center w-[100%] h-[100%] top-0 left-0 bg-opacity-60">
          <div ref={modalRef} className="relative">
            <MediaPanoramicViewer imageUrl={previewImage} />
          </div>
        </div>
        )}
      </div>
  );
};

export default EditMarkerModal;