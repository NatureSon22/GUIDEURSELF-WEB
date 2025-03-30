import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { loggedInUser } from "@/api/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useUserStore from "@/context/useUserStore";

const uploadFloorImage = async (campusId, formData) => {
  console.log("Sending request to server...");
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses/floors/${campusId}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      console.error("Response error:", response.statusText);
      throw new Error("Failed to upload floor.");
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
    console.error("Error uploading floor:", error);
    throw new Error("Failed to upload floor.");
  }
};

const AddFloorModal = ({ closeModal, campusId, refreshFloors, updatedCampus }) => {
  const [errorMessage, setErrorMessage] = useState(""); 
  const { currentUser } = useUserStore((state) => state);
  const [floorName, setFloorName] = useState("");
  const [file, setFile] = useState(null);
  const [date, setDate] = useState(Date.now());
  const [isLoading, isSetLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

    const { data } = useQuery({
      queryKey: ["user"],
      queryFn: loggedInUser,
      refetchOnWindowFocus: false,
    });
          
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

  const { mutate: addFloor } = useMutation({
    mutationFn: (data) => uploadFloorImage(campusId, data),
    onSuccess: async () => {
      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number, // Replace with actual user number
        username: currentUser.username, // Replace with actual username
        firstname: currentUser.firstname, // Replace with actual firstname
        lastname: currentUser.lastname, // Replace with actual lastname
        role_type: currentUser.role_type, // Replace with actual role type
        campus_name: currentUser.campus_name, // Replace with actual campus name
        action: `Added new floor: ${floorName}`,
        date_created: date,
        date_last_modified: Date.now(),
    });
      isSetLoading(true);
      refreshFloors();
      closeModal();
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to add floor.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    isSetLoading(true);

    const formData = new FormData();
    formData.append("floor_name", floorName);
    if (file) formData.append("floor_photo", file);

    const floors = JSON.stringify([{ floor_name: floorName }]);
    formData.append("floors", floors);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
     console.log(formData);
     formData.append("updated_by", `${data?.firstname} ${data?.lastname}`|| "Unknown User");
     formData.append("activity", `Added new floor ${floorName}`);
     formData.append("campus_name", `${updatedCampus.campus_name} Campus` || "Unknown Campus");

    addFloor(formData);
    
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB.");
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Only JPEG or PNG images are allowed.");
        return;
      }
      setFile(selectedFile);

      // Set the image preview
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  return (
    <Dialog open onOpenChange={closeModal} className="z-50">
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">
          {errorMessage}
        </div>
      )}

      <DialogContent className="bg-white p-6 rounded-md w-[80%] md:w-[40%]">
        <DialogHeader>
          <DialogTitle className="text-lg">Add New Floor</DialogTitle>
          <DialogDescription className="text-md">
            Enter the name and upload a floor map.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <Input
              type="text"
              id="floorName"
              placeholder="Floor Name"
              className="w-full px-3 py-2 border text-lg  rounded-md"
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
          <Input
            type="file"
            id="floorImage"
            onChange={handleFileChange}
            className="w-full py-1 px-0"
            required
          />
          {imagePreview ? (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Floor preview"
                className="p-4 w-full border border-dashed h-[300px] object-contain"
              />
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center mt-4 border-dashed border p-6 text-center text-gray-500">
              <p>Upload Image</p>
            </div>
          )}
        </div>


          <DialogFooter className="flex justify-end gap-4">
            <Button
              type="submit"
              className="bg-base-200 text-white px-4 py-2 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Floor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFloorModal;
