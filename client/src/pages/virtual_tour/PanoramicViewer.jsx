import React, { useState, useEffect, useRef } from "react";
import "pannellum";

const PanoramicViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const pannellumViewer = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Lazy load: Detect when the component is visible
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 } // Loads when 20% of the element is visible
    );

    if (viewerRef.current) observer.observe(viewerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && viewerRef.current) {
      if (pannellumViewer.current) {
        pannellumViewer.current.destroy();
      }

      pannellumViewer.current = pannellum.viewer(viewerRef.current, {
        type: "equirectangular",
        panorama: imageUrl,
        autoLoad: true,
        showControls: false, // Hide extra UI controls
        yaw: 180, // Default horizontal view
        pitch: 0, // Keep the camera level
        minPitch: 0, // Prevent vertical movement
        maxPitch: 0, // Lock vertical panning
        hfov: 100, // Field of View (zoom level)
        minHfov: 100, // Prevent zooming out
        maxHfov: 100, // Prevent zooming in
      });
    }

    return () => {
      if (pannellumViewer.current) pannellumViewer.current.destroy();
    };
  }, [isVisible, imageUrl]);

  return <div ref={viewerRef} className="h-full w-full rounded-md bg-gray-200"></div>;
};

export default PanoramicViewer;
