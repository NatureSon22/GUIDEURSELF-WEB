import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const uploadFloorImage = async (campusId, formData) => {
  console.log("Sending request to server...");
  try {
    const response = await fetch(`http://localhost:3000/api/campuses/floors/${campusId}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      console.error("Response error:", response.statusText);
      throw new Error("Failed to upload floor.");
    }

    const data = await response.json();
    console.log("Server response:", data);
    return data;
  } catch (error) {
    console.error("Error uploading floor:", error);
    throw new Error("Failed to upload floor.");
  }
};

const AddFloorModal = ({ closeModal, campusId, refreshFloors }) => {
  const [errorMessage, setErrorMessage] = useState(""); 
  const [floorName, setFloorName] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const { mutate: addFloor, isLoading } = useMutation({
    mutationFn: (data) => uploadFloorImage(campusId, data),
    onSuccess: () => {
      refreshFloors();
      closeModal();
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to add floor.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("floor_name", floorName);
    if (file) formData.append("floor_photo", file);

    const floors = JSON.stringify([{ floor_name: floorName }]);
    formData.append("floors", floors);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
     console.log(formData);
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
