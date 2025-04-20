    import React, { useState, useEffect } from "react";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Button } from "@/components/ui/button";
    import { useToast } from "@/hooks/use-toast";
    import useUserStore from "@/context/useUserStore";
    import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
    import { loggedInUser } from "@/api/auth";
        
    const fetchCampuses = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
          method: "GET",
          credentials: "include",
        });
      
        if (!response.ok) {
          throw new Error("Failed to fetch campuses");
        }
        return response.json();
      }

    const fetchUserRole = async (roleType) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/role-types?name=${roleType}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch role data");
        return response.json();
      };
      
    
    const Modal = ({ closeModal, addOfficial, userData }) => {
        const { currentUser } = useUserStore((state) => state);
        const [positions, setPositions] = useState([]);
        const [campus, setCampus] = useState("");
        const [name, setName] = useState("");
        const [college, setCollege] = useState("");
        const [date, setDate] = useState(Date.now());
        const [position, setPosition] = useState("");
        const [image, setImage] = useState(null);
        const [imagePreview, setImagePreview] = useState(null);
        const [loadingVisible, setLoadingVisible] = useState(false);
        const [loadingMessage, setLoadingMessage] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const { toast } = useToast();

          const { data: userRole } = useQuery({
            queryKey: ["userRole", userData.role_type],
            queryFn: () => fetchUserRole(userData.role_type),
            enabled: !!userData.role_type, // Only fetch if `role_type` is defined
          });

          const isMultiCampus = userData.isMultiCampus ?? false;

          const {
            data: campuses = [],
            isError,
          } = useQuery({
            queryKey: ["campuses"],
            queryFn: fetchCampuses,
          });

        const { data } = useQuery({
            queryKey: ["user"],
            queryFn: loggedInUser,
            refetchOnWindowFocus: false,
        });

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
        
            if (!name) {
                toast({
                    title: "Missing Fields",
                    description: "name field is required.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            if (!image) {
                toast({
                    title: "Missing Fields",
                    description: "image field is required.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }
        

            if (!position) {
                toast({
                    title: "Missing Fields",
                    description: "position field is required.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }
        
        
            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", name);
            formData.append("position_name", position);
            formData.append("campus_name", campus);
            formData.append("college_name", college);
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

                const logResponse = await fetch(`${import.meta.env.VITE_API_URL}/keyofficiallogs`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: name || "Unknown Name",
                      activity: `Added new official ${name}`,
                      updated_by: data?.username || "Unknown User",
                    }),
                  });
                  
              
                  if (!logResponse.ok) {
                    console.error("Failed to log activity:", logResponse.statusText);
                  }
        
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
        
  // Filter and sort campuses alphabetically
  const filteredCampuses = campuses
  .filter((campus) => (isMultiCampus ? true : campus._id === userData.campus_id))
  .sort((a, b) => a.campus_name.localeCompare(b.campus_name)); // Sort alphabetically

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
                                    className="cursor-pointer font-normal text-[0.875rem] w-full h-10 border border-gray-300 rounded-md p-2"
                                >
                                    <option className="font-normal text-[0.875rem]" value="">Select Position</option>
                                    {positions.map((pos) => (
                                        <option className="font-normal text-[0.875rem]" key={pos._id} value={pos.position_name}>
                                            {pos.position_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-4">
                            <Label className="text-lg">Campus</Label>
                            <select
                                value={campus}
                                onChange={(e) => setCampus(e.target.value)} // ✅ corrected here
                                className="cursor-pointer font-normal text-[0.875rem] w-full h-10 border border-gray-300 rounded-md p-2"
                            >
                                <option className="font-normal text-[0.875rem]" value="">
                                Select Campus
                                </option>
                                {filteredCampuses.map((cam) => (
                                <option
                                    className="font-normal text-[0.875rem]"
                                    key={cam._id}
                                    value={cam.campus_name}
                                >
                                    {cam.campus_name}
                                </option>
                                ))}
                            </select>
                            </div>

                            <div className="mt-4">
                            <Label className="text-lg">College</Label>
                            <Input
                                type="text"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                placeholder="Enter name of the college"
                                disabled={!campus} // ✅ works as expected now
                            />
                            </div>


                            {/* Image Upload */}
                            <div className="mt-4">
                                <Label className="text-lg">Upload Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="mt-2 py-1 cursor-pointer "
                                    required
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