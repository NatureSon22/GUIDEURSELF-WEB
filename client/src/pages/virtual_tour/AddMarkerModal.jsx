import React, { useRef, useEffect, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PanoramicViewer from "./PanoramicViewer";
import PreviewPanorama from "./PreviewPanorama";
import { loggedInUser } from "@/api/auth";
import { BsDoorOpenFill } from "react-icons/bs";
import { PiOfficeChairFill } from "react-icons/pi";
import { FaGraduationCap } from "react-icons/fa";
import { MdWidgets } from "react-icons/md";
import { FaFlag } from "react-icons/fa";
import { ImManWoman } from "react-icons/im";
import { HiSquaresPlus } from "react-icons/hi2";
import { useToast } from "@/hooks/use-toast";
import { IoAlertCircle } from "react-icons/io5";

const addMarker = async (campusId, selectedFloor, formData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/campuses/${campusId}/floors/${selectedFloor._id}/markers`,
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

    const logResponse = await fetch(`${import.meta.env.VITE_API_URL}/virtualtourlogs`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campus_name: formData.get("campus_name"),
        activity: formData.get("activity"),
        updated_by: formData.get("updated_by"),
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
  hideMarkers,
  updatedCampus,
}) => {
  const modalRef = useRef(null);
  const [markerName, setMarkerName] = useState("");
  const [markerDescription, setMarkerDescription] = useState("");
  const [markerSubInfo, setMarkerSubInfo] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isMutating, setIsMutating] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isShowed, setIsShowed] = useState(true);
  const [category, setCategory] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isPanorama, setIsPanorama] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsPanorama(false);
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

  const unshowPanorama = () => {
    setIsPanorama(false);
  };

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
        duration: 5000,
      });
    },
  });

  const showPreview = () => {
    setIsAllowed(true);
    setIsShowed(false);
  };

  const unshowPreview = () => {
    setIsAllowed(false);
    setIsShowed(true);
    setCategory("");
    setMarkerDescription("");
  };


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
    const maxSize = 10485760; // 10MB

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const maxSize = 10485760; // 10MB
    

    if (!coordinates?.lat || !coordinates?.lng) {
      setErrorMessage("Please drop a pin on the map to set the location.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!markerName.trim()) {
      setErrorMessage("Location name is required.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (imageFile && imageFile.size > maxSize) {
      setErrorMessage("File size too large. Maximum is 10MB.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setIsMutating(true);
    const formData = new FormData();

    formData.append("marker_name", markerName);
    formData.append("sub_info", markerSubInfo);
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

    hideMarkers();

    formData.append("updated_by", data?.username || "Unknown User");
    formData.append("activity", `Added new location ${markerName}`);
    formData.append("campus_name", `${updatedCampus.campus_name} Campus` || "Unknown Campus");

    addNewMarker(formData, {
      onError: (error) => {
        console.error("Error adding marker:", error);
        setIsMutating(false);
        setErrorMessage(error.message || "Failed to add marker. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      }, 
    });
  };

  // Check if marker is positioned
  const isMarkerPositioned = coordinates?.lat && coordinates?.lng;

  return (
    <div className="bg-secondary-500 h-100vh w-[37%] border-l overflow-y-auto z-1">
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-[100%]">
        <div className="overflow-y-auto p-6 max-h-[calc(100vh-120px)]">
          <Label className="text-lg">Configure this Location</Label>

          <div className="mt-4">
            <Label className="text-[16px]">Location Name</Label>
            <Input
              type="text"
              value={markerName}
              onChange={(e) => setMarkerName(e.target.value)}
              className="w-full p-2 mt-2 border bg-white border-gray-300 rounded-md"
              placeholder="Enter location name"
              disabled={!isMarkerPositioned} // Disable if marker not positioned
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
                disabled={!isMarkerPositioned} // Disable if marker not positioned
              />
            </div>
            {newImagePreview ? (
              <div className="w-[100%] h-[250px] bg-secondary-200 rounded-md mb-4 relative">
                <div className="z-50 absolute flex justify-center items-center bg-black w-[710px] h-[250px] rounded-md opacity-0 hover:opacity-70 transition-opacity duration-400">
                  <Button
                    type="button"
                    onClick={showPanorama}
                    className="text-white h-[40px]"
                    disabled={!isMarkerPositioned} // Disable if marker not positioned
                  >
                    Click to Preview
                  </Button>
                </div>
                <PanoramicViewer imageUrl={newImagePreview} />
              </div>
            ) : (
              <div className="w-[100%] h-[250px] flex items-center justify-center border border-secondary-200 rounded-md border-dashed mb-4">
                <Label className="text-[16px] text-secondary-200">Upload 360 Photo</Label>
              </div>
            )}
          </div>

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
                <div>
                  <div className="mt-4">
                    <Label className="text-[16px]">Area Categories</Label>
                    <Input
                      type="text"
                      value={category}
                      disabled
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 mt-2 border bg-white border-gray-300 rounded-md"
                      placeholder="Choose category"
                    />
                    <div className="flex gap-3 mt-4">
                    <BsDoorOpenFill
                      onClick={isMarkerPositioned ? selectedAcademic : undefined} // Only allow click if marker is positioned
                      className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                        category === "Academic Spaces" ? "text-base-200 border-base-200 border" : "text-black"
                      } ${
                        !isMarkerPositioned ? "opacity-50 pointer-events-none" : "" // Disable style and pointer events
                      }`}
                    />
                    <PiOfficeChairFill
                      onClick={isMarkerPositioned ? selectedOffice : undefined} // Only allow click if marker is positioned
                      className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                        category === "Administrative Offices" ? "text-base-200 border-base-200 border" : "text-black"
                      } ${
                        !isMarkerPositioned ? "opacity-50 pointer-events-none" : "" // Disable style and pointer events
                      }`}
                    />
                    <FaGraduationCap
                      onClick={isMarkerPositioned ? selectedServices : undefined} // Only allow click if marker is positioned
                      className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                        category === "Student Services" ? "text-base-200 border-base-200 border" : "text-black"
                      } ${
                        !isMarkerPositioned ? "opacity-50 pointer-events-none" : "" // Disable style and pointer events
                      }`}
                    />
                    <FaFlag
                      onClick={isMarkerPositioned ? selectedAttraction : undefined} // Only allow click if marker is positioned
                      className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                        category === "Campus Attraction" ? "text-base-200 border-base-200 border" : "text-black"
                      } ${
                        !isMarkerPositioned ? "opacity-50 pointer-events-none" : "" // Disable style and pointer events
                      }`}
                    />
                    <ImManWoman
                      onClick={isMarkerPositioned ? selectedUtility : undefined} // Only allow click if marker is positioned
                      className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                        category === "Utility Areas" ? "text-base-200 border-base-200 border" : "text-black"
                      } ${
                        !isMarkerPositioned ? "opacity-50 pointer-events-none" : "" // Disable style and pointer events
                      }`}
                    />
                    <MdWidgets
                      onClick={isMarkerPositioned ? selectedOther : undefined} // Only allow click if marker is positioned
                      className={`text-[50px] bg-white shadow-md p-2 rounded-md ${
                        category === "Others (Miscellaneous)" ? "text-base-200 border-base-200 border" : "text-black"
                      } ${
                        !isMarkerPositioned ? "opacity-50 pointer-events-none" : "" // Disable style and pointer events
                      }`}
                    />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-[16px]">Description</Label>
                    <Textarea
                      placeholder="Type your marker description here."
                      className="resize-none bg-white mt-2 h-[200px]"
                      value={markerDescription}
                      onChange={(e) => setMarkerDescription(e.target.value)}
                      disabled={!isMarkerPositioned} // Disable if marker not positioned
                    />
                  </div>
                </div>
            </div>)}
            </div>
            

        <div className="mt-6 flex justify-between pt-6 gap-[10px]">
          {errorMessage && (
            <div className="flex border rounded-md w-[1500px] border-accent-100 p-2 gap-2 items-center">
              <IoAlertCircle className="text-accent-100 h-[25px] w-[25px]" />
              <p className="text-red-500 text-sm">{errorMessage}</p>
            </div>
          )}
          <div className="w-[100%] flex gap-1 justify-end">
            <Button
              type="button"
              onClick={closeModal}
              className="text-base-200 bg-white shadow-none hover:bg-secondary-350 w-[100px] p-2 border-none"
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="border border-base-200 bg-base-200 text-white w-[100px] p-2 rounded-md hover:bg-base-200"
              disabled={isMutating || !isMarkerPositioned} // Disable if marker not positioned
            >
              {isMutating ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
        </div>
      </form>

      <div>
        {isPanorama && (
          <div className="bg-black absolute z-50 flex justify-center items-center w-[100%] h-[100%] top-0 left-0 bg-opacity-60">
            <div ref={modalRef} className="relative">
              <PreviewPanorama imageUrl={newImagePreview} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMarkerModal;