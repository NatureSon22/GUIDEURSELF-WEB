import React, { useState, useEffect } from "react";

const EditKeyOfficialsModal = ({ official, closeModal, onUpdate }) => {
    const [positions, setPositions] = useState([]);
    const [name, setName] = useState(official.name || "");
    const [position, setPosition] = useState(official.administrative_position_id || "");  // Pre-select position ID
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(official.key_official_photo_url);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/administartiveposition", {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch positions");
                const data = await response.json();
                setPositions(data);

                console.log("Positions List:", data);
                console.log("Preselected Position ID:", official.administrative_position_id);
                
                // Find and set preselected position
                const matchingPosition = data.find(
                    pos => pos._id.toString() === official.administrative_position_id.toString()
                );

                console.log("Matching Position:", matchingPosition);
                
                if (matchingPosition) {
                    setPosition(matchingPosition._id);  // Set matching position ID
                }
            } catch (error) {
                console.error("Error fetching positions:", error);
            }
        };

        fetchPositions();
    }, [official.administrative_position_id]);  // Refetch if the official changes

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!official || !official._id) {
            console.error("Error: Missing official ID");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("administrative_position_id", position);  // Use selected position ID
        if (image) formData.append("image", image);

        try {
            const response = await fetch(`http://localhost:3000/api/keyofficials/${official._id}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to update official");

            const result = await response.json();
            onUpdate(result.updatedOfficial);
            closeModal();
        } catch (error) {
            console.error("Error updating official:", error);
        }
    };

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

                    <p>{official.position_name}</p>

                    {/* Administrative Position Dropdown */}
                    <div className="mt-4">
                        <label className="block text-lg">Administrative Position</label>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
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
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-w-full max-h-full rounded-md"
                            />
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

export default EditKeyOfficialsModal;
