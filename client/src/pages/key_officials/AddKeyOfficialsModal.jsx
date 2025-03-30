    import React, { useState, useEffect } from "react";
    import { useMutation } from "@tanstack/react-query"; // Import useMutation
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Button } from "@/components/ui/button";
    import { useToast } from "@/hooks/use-toast";
    import useUserStore from "@/context/useUserStore";
    
    const Modal = ({ closeModal, addOfficial }) => {
        const { currentUser } = useUserStore((state) => state);
        const [positions, setPositions] = useState([]);
        const [name, setName] = useState("");
        const [date, setDate] = useState(Date.now());
        const [position, setPosition] = useState("");
        const [image, setImage] = useState(null);
        const [imagePreview, setImagePreview] = useState(null);
        const [loadingVisible, setLoadingVisible] = useState(false);
        const [loadingMessage, setLoadingMessage] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const { toast } = useToast();

        // Fetch positions from the database
        useEffect(() => {
            const fetchPositions = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/administartiveposition`, { method: "get", credentials: "include" });
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
                        variant: "destructive",
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

        // Mutation for logging activity
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
            formData.append("date_added", date);
        
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/keyofficials`, {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });
        
                if (!response.ok) {
                    throw new Error("Failed to save official data");
                }
        
                const savedOfficial = await response.json();
        
                // Log "add" action to ActivityLog
                await logActivityMutation.mutateAsync({
                    user_number: currentUser.user_number, // Replace with actual user number
                    username: currentUser.username, // Replace with actual username
                    firstname: currentUser.firstname, // Replace with actual firstname
                    lastname: currentUser.lastname, // Replace with actual lastname
                    role_type: currentUser.role_type, // Replace with actual role type
                    campus_name: currentUser.campus_name, // Replace with actual campus name
                    action: `Added new key official: ${name}`,
                    date_created: date,
                    date_last_modified: Date.now(),
                });
        
                addOfficial();
                toast({
                    title: "Success",
                    description: "Key Official has been successfully added!",
                    variant: "default",
                });
                closeModal(true);
            } catch (error) {
                console.error("Error saving data:", error);
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
                                    className="font-normal text-[0.875rem] w-full h-10 border border-gray-300 rounded-md p-2"
                                >
                                    <option className="font-normal text-[0.875rem]" value="">Select Position</option>
                                    {positions.map((pos) => (
                                        <option className="font-normal text-[0.875rem]" key={pos._id} value={pos.position_name}>
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
                                            className="w-[100%] object-cover max-h-full rounded-md"
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