import React, { useState, useEffect } from "react";

const PdfPreviewModal = ({ pdfUrl, onClose }) => {
  // Handle clicks outside the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal if the overlay is clicked
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={handleOverlayClick}>
      <div style={modalContentStyle}>
        <iframe
          src={pdfUrl}
          width="100%"
          height="900px"
          title="PDF Preview"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

// Inline styles for the modal
const modalOverlayStyle = {
  position: "fixed",
  borderRadius: "8px",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  borderRadius: "8px",
  width: "80%",
  maxWidth: "2000px",
  position: "relative",
};

export default PdfPreviewModal;