import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useUserStore from "@/context/useUserStore";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";

const updateFloor = async ({ campusId, floorId, formData, }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/campuses/floors/${campusId}/${floorId}`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update floor.");
    }

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

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to update floor.");
  }
};

const EditFloorModal = ({ closeModal, campusId, floorData, refreshFloors, updatedCampus, selectedFloor, setSelectedFloor }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useUserStore((state) => state);
  const [ date, setDate] = useState(floorData.date_added);
  const [floorName, setFloorName] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
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

  useEffect(() => {
    if (floorData) {
      setFloorName(floorData.floor_name);
      setImagePreview(floorData.floor_photo_url);
      setDate(floorData.date_added);
    }
  }, [floorData]);

  const { mutate: updateFloorMutation } = useMutation({
    mutationFn: (formData) => updateFloor({
      campusId,
      floorId: floorData._id,
      formData
    }),
    onSuccess: async (updatedFloor) => {
        refreshFloors();

        await logActivityMutation.mutateAsync({
          user_number: currentUser.user_number, // Replace with actual user number
          username: currentUser.username, // Replace with actual username
          firstname: currentUser.firstname, // Replace with actual firstname
          lastname: currentUser.lastname, // Replace with actual lastname
          role_type: currentUser.role_type, // Replace with actual role type
          campus_name: currentUser.campus_name, // Replace with actual campus name
          action: `Update existing floor: ${floorName}`,
          date_created: date,
          date_last_modified: Date.now(),
      });
      
        // Update the selectedFloor state in parent if needed
        if (selectedFloor && selectedFloor._id === floorData._id) {
          setSelectedFloor({
            ...selectedFloor,
            floor_name: updatedFloor.data.floor_name,
            floor_photo_url: updatedFloor.data.floor_photo_url
          });
        }
        
        closeModal();
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("floor_name", floorName);
    if (file) {
      formData.append("floor_photo", file);
    }

    formData.append("updated_by", `${data?.firstname} ${data?.lastname}`|| "Unknown User");
    formData.append("activity", `Update existing floor ${floorName}`);
    formData.append("campus_name", `${updatedCampus.campus_name} Campus` || "Unknown Campus");

    updateFloorMutation(formData);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file
    if (selectedFile.size > 2 * 1024 * 1024) {
      setErrorMessage("File size must be less than 2MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage("Only JPEG or PNG images are allowed.");
      return;
    }

    setFile(selectedFile);
    setErrorMessage("");
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  return (
    <Dialog open onOpenChange={closeModal} className="z-50">
      <DialogContent className="bg-white p-6 rounded-md max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Floor</DialogTitle>
          <DialogDescription>
            Update the floor details below
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="floorName" className="block text-sm font-medium mb-1">
              Floor Name
            </label>
            <Input
              id="floorName"
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="floorImage" className="block text-sm font-medium mb-1">
              Floor Map Image
            </label>
            <Input
              id="floorImage"
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <div className="mt-2 border rounded-md p-2">
                <img
                  src={imagePreview}
                  alt="Floor preview"
                  className="max-h-40 mx-auto"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-base-200 text-white px-4 py-2 rounded-md"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFloorModal;