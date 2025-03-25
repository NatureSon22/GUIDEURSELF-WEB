import React, { useEffect, useRef, useState } from "react";
import "pannellum";

const PreviewPanorama = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const pannellumViewer = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Lazy Load: Detects if component is visible
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 } // Loads when 20% visible
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
        showControls: false, // Hide extra UI buttons
        yaw: 180, // Default horizontal view
        pitch: 0, // Lock vertical
        minPitch: 0, // Disable vertical panning
        maxPitch: 0, // Prevent looking up/down
        hfov: 50, // Default field of view
        minHfov: 50, // Prevent zooming out
        maxHfov: 50, // Prevent zooming in
      });
    }

    return () => {
      if (pannellumViewer.current) pannellumViewer.current.destroy();
    };
  }, [isVisible, imageUrl]);

  return <div ref={viewerRef} className="h-[800px] w-[450px] rounded-md bg-gray-200"></div>;
};

export default PreviewPanorama;
