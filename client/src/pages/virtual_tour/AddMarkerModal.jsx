import React, { useRef, useEffect, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PanoramicViewer from "./PanoramicViewer";
import PreviewPanorama from "./PreviewPanorama";
import { loggedInUser } from "@/api/auth";
import useUserStore from "@/context/useUserStore";
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
  selectedCategory, 
  setSelectedCategory,
  categoryConfig
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
  const [categoryDescription, setCategoryDescription] = useState("");
  const queryClient = useQueryClient();
  const { currentUser } = useUserStore((state) => state);
  const { toast } = useToast();
  const [isPanorama, setIsPanorama] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
  if (selectedCategory == "Academic Spaces") {
    setCategoryDescription("Areas dedicated to learning, including classrooms, lecture halls, and study zones.");
  }

  if (selectedCategory == "Administrative Offices") {
    setCategoryDescription("Offices where faculty and staff manage campus operations and student affairs.");
  }

  if (selectedCategory == "Student Services") {
    setCategoryDescription("Facilities that support student needs, such as counseling, career centers, and advisories.");
  }

  if (selectedCategory == "Campus Attraction") {
    setCategoryDescription("Key locations that highlight the vibrant and historic aspects of the campus.");
  }

  if (selectedCategory == "Utility Areas") {
    setCategoryDescription("Essential service areas, such as restrooms, maintenance rooms, and storage spaces.");
  }

  if (selectedCategory == "Multi-Purpose") {
    setCategoryDescription("A flexible space for meetings, events, and student activities.");
  }

  if (selectedCategory == "Others (Miscellaneous)") {
    setCategoryDescription("Uncategorized areas or locations with unique purposes within the campus.");
  }

  if (selectedCategory == "") {
    setCategoryDescription("");
  }
  
},);

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

  const { mutate: addNewMarker } = useMutation({
    mutationFn: (data) => addMarker(campusId, selectedFloor, data),
    onSuccess: async () => {
      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number, // Replace with actual user number
        username: currentUser.username, // Replace with actual username
        firstname: currentUser.firstname, // Replace with actual firstname
        lastname: currentUser.lastname, // Replace with actual lastname
        role_type: currentUser.role_type, // Replace with actual role type
        campus_name: currentUser.campus_name, // Replace with actual campus name
        action: `Added new location: ${markerName}`,
        date_created: Date.now(),
        date_last_modified: Date.now(),
    });
      setIsMutating(false);
      queryClient.invalidateQueries(["campuses", campusId._id]);
      closeModal();
      setCategoryDescription("");
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
    setCategoryDescription("");
    setIsShowed(true);
    setSelectedCategory("");
    setMarkerDescription("");
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
    

    if (!markerDescription.trim()) {
      setErrorMessage("Location description is required.");
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

    if (selectedCategory.trim()) {
      formData.append("category", selectedCategory);
    }

    if (imageFile) {
      formData.append("marker_photo", imageFile);
    }

    hideMarkers();

    formData.append("updated_by", `${data?.firstname} ${data?.lastname}`|| "Unknown User");
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
        <div className="overflow-y-auto p-6 justify-between max-h-[calc(100vh-120px)]">
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
                  <Label className="text-[16px]">Description</Label>
                  <Textarea
                    placeholder="Type your marker description here."
                    className="resize-none bg-white mt-2 h-[200px]"
                    value={markerDescription}
                    onChange={(e) => setMarkerDescription(e.target.value)}
                    disabled={!isMarkerPositioned} // Disable if marker not positioned
                  />
                </div>
  
          <div className="mt-4">
            <Label className="text-[16px]">Upload Panoramic Photo</Label>
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
                <PanoramicViewer imageUrl={newImagePreview} />
              </div>
            ) : (
              <div className="w-[100%] h-[250px] flex items-center justify-center border border-secondary-200 rounded-md border-dashed mb-4">
                <Label className="text-[16px] text-secondary-200">Upload Panoramic Photo</Label>
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
                <div className="mt-4 flex flex-col">
                  <Label className="text-[16px]">Area Categories</Label>
                  <Input
                    type="text"
                    value={selectedCategory}
                    className="w-full p-2 mt-2 border bg-white border-gray-300 rounded-md"
                    placeholder="Choose category"
                  />
                  <div className="flex gap-3 mt-4">
                  {Object.entries(categoryConfig).map(([cat, { icon: IconComponent, textColor, color, borderColor }]) => (
                    <IconComponent
                      key={cat}   
                      onClick={isMarkerPositioned ? () => setSelectedCategory(cat) : undefined} 
                      className={`text-[50px] bg-white shadow-md p-2 rounded-md transition-all duration-200
                        ${selectedCategory === cat ? `${textColor} ${borderColor} border` : "text-black"} 
                        ${!isMarkerPositioned ? "opacity-50 pointer-events-none" : ""} 
                      `}
                    />
                  ))}

                  </div>
                  <Label className="text-[14px] pl-2 !mt-4 text-secondary-100-75">{categoryDescription}</Label>
                </div>
  
              </div>
            )}
          </div>
        </div>
  
        <div className="mt-6 flex justify-between p-6 gap-[10px]">
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