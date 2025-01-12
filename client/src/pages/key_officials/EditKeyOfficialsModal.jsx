import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const EditKeyOfficialsModal = ({ official, closeModal, onUpdate }) => {
    const queryClient = useQueryClient();

    // Local state for form inputs
    const [name, setName] = useState(official.name || "");// Use `official.administrative_position_id` instead of `official.position_name`
    const [position, setPosition] = useState(official.administrative_position_id);    
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(official.key_official_photo_url);

    // Fetch administrative positions
    const { data: positions, isLoading, error } = useQuery({
        queryKey: ["positions"],
        queryFn: async () => {
            const response = await fetch("http://localhost:3000/api/administartiveposition", {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch positions");
            return response.json();
        },
    });

    useEffect(() => {
        if (!official || !official.administrative_position_id) {
            console.log("No administrative_position_id available for official.");
        }
    }, [official]);    

    const mutation = useMutation({
        mutationFn: async ({ officialId, formData }) => {
          const response = await fetch(`http://localhost:3000/api/keyofficials/${officialId}`, {
            method: "PUT",
            credentials: "include",
            body: formData,
          });
          if (!response.ok) throw new Error("Failed to update official");
          return response.json();
        },
        onSuccess: () => {
          if (onUpdate) {
            onUpdate(); // Notify parent to refresh data
          }
          closeModal(); // Close the modal
        },
        onError: (err) => {
          console.error("Error updating official:", err);
        },
      });      

      useEffect(() => {
        if (positions && official?.administrative_position_id) {
            setPosition(official.administrative_position_id); // Match by `_id`
        }
    }, [positions, official?.administrative_position_id]);
    
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        if (!official || !official._id) {
            console.error("Error: Missing official ID");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("administrative_position_id", position);
        if (image) formData.append("image", image);

        mutation.mutate({ officialId: official._id, formData });
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading positions: {error.message}</p>;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc]">
            <div className="bg-white p-6 rounded-md w-1/3">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mt-4">
                        <label className="block text-lg">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter Name"
                        />
                    </div>

                    {/* Administrative Position Dropdown */}
                    <div className="mt-4">
                        <label className="block text-lg">Administrative Position</label>
                        <select
                            value={position} // Ensure `position` is set to the `_id` of the selected position
                            onChange={(e) => setPosition(e.target.value)} // Update `position` to the selected `_id`
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select Position</option>
                            {positions.map((pos) => (
                                <option key={pos._id} value={pos._id}>
                                    {pos.administartive_position_name}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="mt-4">
                        <label className="block text-lg pb-[10px]">Upload Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    <div className="mt-4">
                        <div className="w-[200px] h-[200px] border border-dashed border-gray-300 rounded-md flex justify-center items-center mt-2">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-full max-h-full rounded-md"
                                />
                            ) : (
                                <span>No image selected</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-[10px]">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-blue-500 w-[100px] p-2 border-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-500 text-white w-[100px] p-2 rounded-md"
                        >
                            {mutation.isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditKeyOfficialsModal;
