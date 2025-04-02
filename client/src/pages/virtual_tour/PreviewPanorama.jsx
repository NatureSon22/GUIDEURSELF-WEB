import React, { useEffect, useRef, useState } from "react";
import "pannellum";
import { Label } from "@/components/ui/label";

const PreviewPanorama = ({ imageUrl, markerName, markerDescription }) => {
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

  return (
    <div className="border border-black flex p-6 gap-6 h-[700px] w-[900px] rounded-md bg-white">
      
    <div className="w-[500px] h-[100%]">
    <div ref={viewerRef} className="border border-black rounded-md bg-gray-200"></div> 
    </div>
      
      <div  className="w-[500px] gap-6 flex flex-col h-[100%]">
      <Label className="text-[22px]">{markerName}</Label>
      {/* Scrollable Description */}
      <div className="max-h-[490px] text-justify min-h-[200px] overflow-y-auto pr-4"> {/* Adjust max-h as needed */}
        <Label className="text-[19px] text-justify">{markerDescription}</Label>
      </div>
      </div>
    </div>
  )
};

export default PreviewPanorama;
