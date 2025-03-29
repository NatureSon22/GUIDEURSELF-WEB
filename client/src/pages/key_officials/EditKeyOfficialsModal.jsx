import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; 
import useUserStore from "@/context/useUserStore";

const EditKeyOfficialsModal = ({ official, closeModal, onUpdate }) => {
  const { currentUser } = useUserStore((state) => state);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [position, setPosition] = useState(official?.position_name || "");
  const [name, setName] = useState(official?.name || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(official?.key_official_photo_url || "");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch administrative positions
  const { data: positions = [], error } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/administartiveposition`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch positions");
      return response.json();
    },
  });

  // Mutation for updating key official
  const mutation = useMutation({
    mutationFn: async ({ officialId, formData }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/keyofficials/${officialId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      await logActivityMutation.mutateAsync({
        user_number: currentUser.user_number, // Replace with actual user number
        username: currentUser.username, // Replace with actual username
        firstname: currentUser.firstname, // Replace with actual firstname
        lastname: currentUser.lastname, // Replace with actual lastname
        role_type: currentUser.role_type, // Replace with actual role type
        campus_name: currentUser.campus_name, // Replace with actual campus name
        action: `Edit key official ${name}`,
    });
      if (!response.ok) throw new Error("Failed to update official");
      return response.json();
    },
    onSuccess: () => {
      setIsLoading(true);
      queryClient.invalidateQueries(["keyOfficials"]);
      if (onUpdate) onUpdate();
      toast({
        title: "Success",
        description: "Key Official has been successfully updated!",
        variant: "default",
      });
      
      setIsLoading(false);
      closeModal();
    },
    onError: (err) => {
      console.error("Mutation error:", err);
      toast({
        title: "Error",
        description: "Failed to update Key Official. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
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

  // Handle save
  const handleSave = () => {
    
    setIsLoading(true);
    if (!official || !official._id) {
      console.error("Error: Missing official ID");
      return;
    }

    if (!name || !position) {
      toast({
        title: "Missing Fields",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("position_name", position);
    if (image) formData.append("image", image);

    

    setIsLoading(true);
    mutation.mutate({ officialId: official._id, formData });
  };

  if (error) return <p>Error fetching positions</p>;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc]">
      <div className="bg-white p-6 rounded-md w-1/3">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Name Input */}
          <div className="mt-4">
            <Label className="block text-[17px] pb-2">Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Name"
            />
          </div>

          {/* Administrative Position Dropdown */}
          <div className="mt-4">
            <Label className="block text-[17px] pb-2">Administrative Position</Label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full p-2 border text-[15px] border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select new position
              </option>
              {positions.map((pos) => (
                <option key={pos._id} value={pos.position_name}>
                  {pos.position_name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="mt-4">
            <Label className="block text-[17px] pb-2">Upload Image</Label>
            <Input type="file" className="mt-2 pt-[5px] cursor-pointer" accept="image/*" onChange={handleImageUpload} />
          </div>

          {/* Image Preview */}
          <div className="mt-4">
            <div className="w-[200px] h-[200px] border border-dashed border-gray-300 rounded-md flex justify-center items-center mt-2">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-[100%] object-cover max-h-full rounded-md"
                />
              ) : (
                <span>No image selected</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-[10px]">
            <Button
              type="button"
              onClick={closeModal}
              className="text-base-200 bg-white shadow-none hover:bg-secondary-350 w-[100px] p-2 border-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-base-200 text-white w-[100px] p-2 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditKeyOfficialsModal;