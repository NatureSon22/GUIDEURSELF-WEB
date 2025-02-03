import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

// Modal Component
const Modal = ({ closeModal, addOfficial }) => {
    const [positions, setPositions] = useState([]);
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loadingVisible, setLoadingVisible] = useState(false); // For loading modal
    const [loadingMessage, setLoadingMessage] = useState(""); // Loading message text
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast(); // Initialize the toast function

    // Fetch positions from the database
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/administartiveposition", { method: "get", credentials: "include" });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setPositions(data);
            } catch (error) {
                console.error("Error fetching positions:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch positions.",
                    variant: "destructive", // Use a destructive variant for errors
                });
            }
        };

        fetchPositions();
    }, [toast]);

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {

        
        setIsLoading(true);

        if (!name || !position || !image) {
            toast({
                title: "Missing Fields",
                description: "All fields are required.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("name", name);
        formData.append("campus_id", "675cd6ff56f690410f1473af");
        formData.append("position_name", position);

        try {
            const response = await fetch("http://localhost:3000/api/keyofficials", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to save official data");
            }


            const savedOfficial = await response.json();
            // Trigger a refetch in the parent component
            addOfficial();
            // setLoadingMessage("Key Official has been successfully added!");
            // setLoadingVisible(true);

            // Show success toast
            toast({
                title: "Success",
                description: "Key Official has been successfully added!",
                variant: "default", // Use default variant for success
            });

            // setTimeout(() => {
            //     setLoadingVisible(false);
                 closeModal(true);
            // }, 2000);
        } catch (error) {
            console.error("Error saving data:", error);
            // Show error toast
            toast({
                title: "Error",
                description: "Failed to save official data.",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[#000000cc]">
            {loadingVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md text-center">
                        <p className="text-xl font-semibold text-gray-800">{loadingMessage}</p>
                    </div>
                </div>
            )}
            {!loadingVisible && (
                <div className="bg-white p-6 rounded-md w-1/3">
                    <form onSubmit={(e) => e.preventDefault()}>
                        {/* Name Input */}
                        <div className="mt-4">
                            <Label className="text-lg">Name</Label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                placeholder="Enter name of the official"
                            />
                        </div>

                        {/* Position Dropdown */}
                        <div className="mt-4">
                            <Label className="text-lg">Administrative Position</Label>
                            <select
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Position</option>
                                {positions.map((pos) => (
                                    <option key={pos._id} value={pos.position_name}>
                                        {pos.position_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div className="mt-4">
                            <Label className="text-lg">Upload Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="mt-2 py-1"
                            />
                        </div>

                        {/* Image Preview */}
                        <div className="mt-4">
                            <div className="w-[200px] h-[200px] border border-dashed border-gray-300 rounded-md flex justify-center items-center mt-2">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full object-cover max-h-full rounded-md"
                                    />
                                ) : (
                                    <span className="text-gray-500">No image uploaded</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-[10px]">
                            <Button
                                type="button"
                                onClick={closeModal}
                                className="text-base-200 bg-white shadow-none hover:bg-secondary-350 w-[100px] p-2 border-none"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSave}
                                className="bg-base-200 text-white w-[100px] p-2 rounded-md"
                                disabled={isLoading}
                            >
                                {isLoading ? "Adding..." : "Add"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Modal;