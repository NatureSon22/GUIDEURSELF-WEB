import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const updateFloor = async ({ campusId, floorId, formData }) => {
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

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to update floor.");
  }
};

const EditFloorModal = ({ closeModal, campusId, floorData, refreshFloors, selectedFloor, setSelectedFloor }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [floorName, setFloorName] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (floorData) {
      setFloorName(floorData.floor_name);
      setImagePreview(floorData.floor_photo_url);
    }
  }, [floorData]);

  const { mutate: updateFloorMutation } = useMutation({
    mutationFn: (formData) => updateFloor({
      campusId,
      floorId: floorData._id,
      formData
    }),
    onSuccess: (updatedFloor) => {
        refreshFloors();
      
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