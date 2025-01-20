import React, { useState } from "react";

const AddMarkerModal = ({ isOpen, onClose, onSave }) => {
  const [markerData, setMarkerData] = useState({
    marker_name: "",
    marker_description: "",
    marker_photo_url: "",
  });

  const handleChange = (e) => {
    setMarkerData({ ...markerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(markerData); // Save the marker data
  };

  if (!isOpen) return null;

  return (
    <div className="">
      <div className="modal-content">
        <h2>Add New Marker</h2>
        <input
          name="marker_name"
          placeholder="Marker Name"
          value={markerData.marker_name}
          onChange={handleChange}
        />
        <textarea
          name="marker_description"
          placeholder="Marker Description"
          value={markerData.marker_description}
          onChange={handleChange}
        />
        <input
          name="marker_photo_url"
          placeholder="Marker Photo URL"
          value={markerData.marker_photo_url}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddMarkerModal;
