import React, { useState, useEffect, useRef } from "react";
import "pannellum";

const LazyMediaPanoramicViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const pannellumViewer = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
        showControls: false,
        hfov: 100,
        pitch: 0, // Keep the camera level
        minPitch: 0, // Prevent looking up or down
        maxPitch: 0, // Lock vertical movement
        yaw: 180, // Default horizontal view
        minHfov: 100, // Prevent zooming out
        maxHfov: 100, // Prevent zooming in
      });
    }

    return () => {
      if (pannellumViewer.current) pannellumViewer.current.destroy();
    };
  }, [isVisible, imageUrl]);

  return <div ref={viewerRef} className="h-[100%] w-full rounded-md bg-gray-200"></div>;
};

export default LazyMediaPanoramicViewer;
