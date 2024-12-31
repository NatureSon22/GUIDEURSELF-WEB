import React, { useState, useEffect } from "react";

// Modal Component
const Modal = ({ closeModal, addOfficial }) => {
    const [positions, setPositions] = useState([]);
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch positions from the database
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/administartiveposition", {method:"get", credentials:"include"} );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setPositions(data);
            } catch (error) {
                console.error("Error fetching positions:", error);
            }
        };

        fetchPositions();
    }, []);

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
        if (!name || !position) {
            console.error("Name and position are required");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("name", name);
        formData.append("position", position);
        formData.append("campus_id", "675cd6ff56f690410f1473af");
        formData.append("administrative_position_id", position);

        try {
            const response = await fetch("http://localhost:3000/api/keyofficials",  {
                method: "POST",
                body: formData,
                credentials:"include"
            });

            if (!response.ok) {
                throw new Error("Failed to save official data");
            }

            const savedOfficial = await response.json();

            // Call the addOfficial callback to update the parent component
            const newOfficial = {
                name: savedOfficial.data.name,
                key_official_photo_url: savedOfficial.data.key_official_photo_url,
                position_name: positions.find((pos) => pos._id === position)?.administartive_position_name,
            };

            addOfficial(newOfficial);

            closeModal();
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-1/3">

                <form onSubmit={(e) => e.preventDefault()}>
                    {/* Name Input */}
                    <div className="mt-4">
                        <h2 className="text-lg">Name</h2>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                            placeholder="Enter name of the official"
                        />
                    </div>

                    {/* Position Dropdown */}
                    <div className="mt-4">
                        <h2 className="text-lg">Administrative Position</h2>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select Position</option>
                            {positions.map((pos) => (
                                <option key={pos._id} value={pos._id}>
                                    {pos.administartive_position_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div className="mt-4">
                        <h2 className="text-lg">Upload Image</h2>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-2"
                        />
                    </div>

                    {/* Image Preview */}
                    <div className="mt-4">
                        <div className="w-full h-[200px] border border-dashed border-gray-300 rounded-md flex justify-center items-center mt-2">
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
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
