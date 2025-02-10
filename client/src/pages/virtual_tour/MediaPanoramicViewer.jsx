import React, { useEffect, useRef } from 'react';
import Marzipano from 'marzipano'; 

const MediaPanoramicViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  
  useEffect(() => {
    if (viewerRef.current) {
      const panoElement = viewerRef.current;
      const viewer = new Marzipano.Viewer(panoElement);
      const source = Marzipano.ImageUrlSource.fromString(imageUrl);
      const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

      // Set a small pitch range to disable vertical movement without breaking the view
      const limiter = Marzipano.RectilinearView.limit.pitch(-0.300, 0.300);

      const view = new Marzipano.RectilinearView({ yaw: Math.PI, pitch: 0 }, limiter);
      const scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
      });
      
      scene.switchTo();
    }
  }, [imageUrl]);

  return (
    <div id="pano" className="h-[800px] relative w-[450px] rounded-md" ref={viewerRef}></div>
  );
};

export default MediaPanoramicViewer;
