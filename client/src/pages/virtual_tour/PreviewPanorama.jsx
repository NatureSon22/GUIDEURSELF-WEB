import React, { useEffect, useRef, useState } from "react";
import "pannellum";
import { Label } from "@/components/ui/label";
import { FaLocationArrow } from "react-icons/fa";
import "@/fluttermap.css";

const PreviewPanorama = ({ imageUrl, markerName, markerDescription, markerCategory, categoryConfig }) => {
  const viewerRef = useRef(null);
  const nameContainerRef = useRef(null);
  const textRef = useRef(null);
  const pannellumViewer = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [containerWidth, setContainerWidth] = useState(100); // Default min-width
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const container = nameContainerRef.current;
    const textElement = textRef.current;
    
    if (!container || !textElement) return;
  
    // Calculate text width and container size
    const singleTextWidth = textElement.getBoundingClientRect().width;
    const containerWidthValue = Math.min(Math.max(singleTextWidth + 60, 80), 675);
    setContainerWidth(containerWidthValue);
  
    // Only scroll if text overflows
    const needsScroll = singleTextWidth > containerWidthValue - 60;
    setShouldScroll(needsScroll);
  
    if (!needsScroll) return;
  
    // Prepare scroll parameters
    const scrollSpeed = 50; // pixels per second (adjust as needed)
    let animationId;
    let lastTimestamp = 0;
    let scrollPosition = 0;
  
    const animateScroll = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        animationId = requestAnimationFrame(animateScroll);
        return;
      }
  
      const deltaTime = (timestamp - lastTimestamp) / 1000; // Time difference in seconds
      lastTimestamp = timestamp;
  
      // Update scroll position
      scrollPosition += scrollSpeed * deltaTime;
  
      // Apply the scroll position to the container
      container.scrollLeft = scrollPosition;
  
      // Continue the animation
      animationId = requestAnimationFrame(animateScroll);
    };
  
    // Start the animation
    animationId = requestAnimationFrame(animateScroll);
  
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [markerName]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
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
        yaw: 180,
        pitch: 0,
        minPitch: 0,
        maxPitch: 0,
        hfov: 50,
        minHfov: 50,
        maxHfov: 50,
      });
    }

    return () => {
      if (pannellumViewer.current) pannellumViewer.current.destroy();
    };
  }, [isVisible, imageUrl]);

  // Get category details
  const categoryDetails = categoryConfig[markerCategory] || {};
  const IconComponent = categoryDetails.icon || FaLocationArrow; // Default icon if category is missing

  return (
    <div className="border border-black flex p-6 gap-6 h-[880px] w-[1500px] rounded-md bg-white">
      <div className="w-[70%] h-[100%]">
        <div ref={viewerRef} className="border border-black rounded-md bg-gray-200"></div> 
      </div>
        
      <div className="w-[50%] gap-6 flex flex-col h-[100%]">
        
        <div className="flex flex-col gap-3">
        
        {markerCategory && (
          <div className={`flex items-center py-2 px-4 rounded-[50px] max-w-fit whitespace-normal break-words relative ${categoryDetails.color || "bg-gray-300"}`}>
            {React.createElement(IconComponent, { className: `absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-xl` })}
            <Label className={`text-[20px] px-4 pl-7 text-white`}>
              {markerCategory}
            </Label>
          </div>
          )}

          <div
          className="relative bg-base-200 rounded-[50px] py-2 px-4 pl-[45px] flex items-center"
          style={{ width: `${containerWidth}px` }}
        >
          <FaLocationArrow className="absolute left-4 text-white" />
          <div ref={nameContainerRef} className="overflow-hidden whitespace-nowrap relative w-full">
            <div className="flex min-w-max" ref={textRef}>
              <Label className="text-[20px] text-white">
              {shouldScroll ? new Array(100).fill(`${markerName} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`).join('') : markerName}
              </Label>
            </div>
          </div>
        </div>

        </div>

        {/* Scrollable Description */}
        <div className="max-h-[490px] text-justify min-h-[200px] overflow-y-auto pr-4 break-words">
          <Label className="text-[19px] text-justify">{markerDescription}</Label>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanorama;
