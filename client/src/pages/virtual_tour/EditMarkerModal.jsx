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
  
  const queryClient = useQueryClient(); 

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
    if (file) {
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
    <div className="bg-secondary-500 h-100vh w-[35%] border-l overflow-y-auto">
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
                className="bg-white w-[50%] cursor-pointer mb-4  py-1 px-0  "
              />
              </div>
              {newImagePreview ? (
              <div className="w-[100%] h-[250px] bg-secondary-200 rounded-md mb-4">
                <PanoramicViewer 
                  imageUrl={newImagePreview} 
                />
              </div>
              ) : (
                <div className="w-[100%] h-[250px] bg-secondary-200 rounded-md mb-4">
                <PanoramicViewer 
                  imageUrl={marker.marker_photo_url} 
                />
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
              <div className="mt-6 flex justify-end p-6 gap-[10px]">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-base-200 w-[100px] p-2 border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-base-200 text-white w-[100px] p-2 rounded-md"
                  disabled={isMutating}
                >
                  {isMutating ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          <div>   
        </div>
      </div>
  );
};

export default EditMarkerModal;